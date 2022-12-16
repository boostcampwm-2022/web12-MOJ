import sys
import json
import os
import resource
import ctypes
import signal
import subprocess
from pty import STDERR_FILENO, STDIN_FILENO, STDOUT_FILENO
from stat import S_IRUSR, S_IWUSR


libc = ctypes.CDLL('/lib/x86_64-linux-gnu/libc.so.6')
ptrace = libc.ptrace
ptrace.argtypes = [ctypes.c_int, ctypes.c_int,
                   ctypes.c_void_p, ctypes.c_void_p]
ptrace.restype = ctypes.c_int


class user_regs_struct(ctypes.Structure):
    _fields_ = [
        ("r15", ctypes.c_ulonglong),
        ("r14", ctypes.c_ulonglong),
        ("r13", ctypes.c_ulonglong),
        ("r12", ctypes.c_ulonglong),
        ("rbp", ctypes.c_ulonglong),
        ("rbx", ctypes.c_ulonglong),
        ("r11", ctypes.c_ulonglong),
        ("r10", ctypes.c_ulonglong),
        ("r9", ctypes.c_ulonglong),
        ("r8", ctypes.c_ulonglong),
        ("rax", ctypes.c_ulonglong),
        ("rcx", ctypes.c_ulonglong),
        ("rdx", ctypes.c_ulonglong),
        ("rsi", ctypes.c_ulonglong),
        ("rdi", ctypes.c_ulonglong),
        ("orig_rax", ctypes.c_ulonglong),
        ("rip", ctypes.c_ulonglong),
        ("cs", ctypes.c_ulonglong),
        ("eflags", ctypes.c_ulonglong),
        ("rsp", ctypes.c_ulonglong),
        ("ss", ctypes.c_ulonglong),
        ("fs_base", ctypes.c_ulonglong),
        ("gs_base", ctypes.c_ulonglong),
        ("ds", ctypes.c_ulonglong),
        ("es", ctypes.c_ulonglong),
        ("fs", ctypes.c_ulonglong),
        ("gs", ctypes.c_ulonglong),
    ]


def print_exit(message: dict):
    print(json.dumps(message, ensure_ascii = False))
    sys.stdout.flush()
    sys.exit(0)


def get_systemcall_names() -> list[str]:
    syscallpath = '/usr/include/x86_64-linux-gnu/asm/unistd_64.h'

    arr = []
    with open(syscallpath, 'r') as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith('#define __NR_'):
                syscallnum = int(line.split(' ')[2])
                syscallname = line.split(' ')[1][5:]

                while len(arr) < syscallnum:
                    arr.append('unknown')

                arr.append(syscallname)

    return arr


def set_limits(time_limit: int, memory_limit: int):
    # 시간 제한
    # ms 를 s로 변환 ( 올림 )
    time_limit = (time_limit + 999) // 1000
    # soft limit과 hard limit의 차이를 줘야함
    resource.setrlimit(resource.RLIMIT_CPU, (time_limit, time_limit + 1))

    # 메모리 제한
    # MB를 Byte로 변환
    memory_limit = memory_limit * 1024 * 1024
    resource.setrlimit(resource.RLIMIT_AS, (memory_limit, memory_limit))

    # 출력 제한
    output_limit = 64 * 1024 * 1024  # 64 MB
    resource.setrlimit(resource.RLIMIT_FSIZE, (output_limit, output_limit))


def get_memory_usage(pid: int) -> int:
    total = 0
    with open('/proc/{}/maps'.format(pid), 'r') as f:
        for line in f.readlines():
            sline = line.split()
            start, end = sline[0].split('-')

            start = int(start, 16)
            end = int(end, 16)

            total += end - start
    return total // 1024


def compare_output(
    testcase_output_path: str,
    user_output_path: str
):
    with open(testcase_output_path, 'r') as answer, open(user_output_path, 'r') as output:
        output_lines = [
            line.strip()+'\n' for line in output.read().strip().splitlines()]
        answer_lines = [
            line.strip()+'\n' for line in answer.read().strip().splitlines()]

        if len(output_lines) != len(answer_lines):
            return False

        for output_line, answer_line in zip(output_lines, answer_lines):
            if output_line != answer_line:
                return False
        return True


def compile(execute_path: str, compile_command: str):
    try:
        compile_process = subprocess.Popen(
            compile_command, shell=True, cwd=execute_path, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        compile_process.wait(30)
        return compile_process.returncode == 0
    except:
        return False

def run_testcase(
    execute_path: str,
    execute_command: str,
    testcase_input_path: str,
    testcase_output_path: str,
    user_output_path: str,
    time_limit: int,
    memory_limit: int,
    systemcall_names: list[str]
):
    result = None

    child = os.fork()
    if child == 0:
        fdin = os.open(testcase_input_path, os.O_RDONLY)
        os.dup2(fdin, STDIN_FILENO)
        os.close(fdin)

        fdout = os.open(user_output_path, os.O_RDWR |
                        os.O_CREAT, S_IRUSR | S_IWUSR)
        os.dup2(fdout, STDOUT_FILENO)
        os.close(fdout)

        fderr = os.open(os.devnull, os.O_RDWR, S_IRUSR | S_IWUSR)
        os.dup2(fderr, STDERR_FILENO)
        os.close(fderr)

        set_limits(time_limit, memory_limit)

        ptrace(0, 0, None, None)

        os.chdir(execute_path)
        execute_command = execute_command.split(' ')
        os.execvp(execute_command[0], execute_command)
    else:
        status: int = 1
        rusage = None
        memory: int = 0
        # 메모리 변화에 영향을 주는 시스템 호출
        memory_syscall = ['mmap', 'brk', 'munmap', 'mremap', 'execve']
        # 위험한 시스템 호출
        danger_syscall = ['vfork', 'fork', 'clone', 'clone3', 'kill']

        while True:
            _, _status, _rusage = os.wait4(child, 0)
            status = _status
            rusage = _rusage

            if os.WIFEXITED(status):
                break

            if os.WIFSTOPPED(status):
                if os.WSTOPSIG(status) == signal.SIGXCPU:
                    result = "시간 초과"
                    os.kill(child, signal.SIGXCPU)
                    break
                if os.WSTOPSIG(status) == signal.SIGSEGV:
                    result = "메모리 초과" # 런타임에러
                    os.kill(child, signal.SIGSEGV)
                    break
                if os.WSTOPSIG(status) == signal.SIGXFSZ:
                    result = "출력 초과"
                    os.kill(child, signal.SIGXFSZ)
                    break

            if os.WIFSIGNALED(status):
                result = "런타임 에러"
                break

            regs = user_regs_struct()
            ptrace(12, child, None, ctypes.byref(regs))

            if systemcall_names[regs.orig_rax] in memory_syscall:
                now_memory = get_memory_usage(child)
                memory = max(memory, now_memory)

            if systemcall_names[regs.orig_rax] in danger_syscall:
                result = "허용되지 않은 시스템 호출"
                os.kill(child, signal.SIGKILL)
                break

            ptrace(24, child, None, None)

        exitcode = os.WEXITSTATUS(status)

        if exitcode == 0:
            if compare_output(testcase_output_path, user_output_path):
                result = "정답"
            else:
                result = "오답"
        else:
            if result == None:
                result = "런타임 에러"
        
        time = int((rusage[0] + rusage[1]) * 1000)
        
        # 밀리초 단위는 시스템적으로 제어가 불가능해 직접 계산
        if time > time_limit:
            result = "시간 초과"

        return result, memory, time


if __name__ == "__main__":
    _, time_limit, memory_limit = sys.argv

    try:
        time_limit = int(time_limit)

        if time_limit < 100 or time_limit > 10000:
            raise

        memory_limit = int(memory_limit)

        if memory_limit < 64 or memory_limit > 1024:
            raise
    except:
        print_exit({"result": "오류 발생"})

    base_submission_path = '/submission'

    lst = os.listdir(base_submission_path)
    code_filename = ''
    testcase_input_paths = []
    testcase_output_paths = []

    for name in lst:
        if name.endswith('.in'):
            testcase_input_paths.append(os.path.join(base_submission_path, name))
        elif name.endswith('.out'):
            testcase_output_paths.append(os.path.join(base_submission_path, name))
        else:
            code_filename = name

    testcase_input_paths.sort()
    testcase_output_paths.sort()


    compile_result = compile(base_submission_path, "python3 -m py_compile {}".format(code_filename))

    if not compile_result:
        print_exit({"result": "컴파일 에러"})

    output_path = os.path.join(base_submission_path, 'a.out')
    systemcall_names = get_systemcall_names()

    max_time = 0
    max_memory = 0

    for testcase_input_path, testcase_output_path in zip(testcase_input_paths, testcase_output_paths):
        testcase_result, testcase_memory, testcase_time = run_testcase(
            base_submission_path,
            "python3 {}".format(code_filename),
            testcase_input_path,
            testcase_output_path,
            output_path,
            time_limit,
            memory_limit,
            systemcall_names
        )

        os.remove(output_path)

        if testcase_result != "정답":
            print_exit({"result": testcase_result})

        max_memory = max(max_memory, testcase_memory)
        max_time = max(max_time, testcase_time)


    print_exit({"result": "정답", "memory": max_memory, "time": max_time})
