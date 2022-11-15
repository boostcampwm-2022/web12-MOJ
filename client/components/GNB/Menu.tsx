import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const menuStyle = css`
  & span a {
    color: white;
    text-decoration: none;
    margin: 0 5px;
  }
`;

const unSelectedAnchor = css`
  color: rgba(255, 255, 255, 0.6) !important;
`;

interface MenuProps {
  isLoggedIn: boolean;
}

function Menu({ isLoggedIn }: MenuProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div css={menuStyle}>
      <span>
        <Link css={currentPath !== '/' && unSelectedAnchor} href={'/'}>
          문제 목록
        </Link>
      </span>
      <span>
        <Link
          css={currentPath !== '/status' && unSelectedAnchor}
          href={'/status'}
        >
          채점 현황
        </Link>
      </span>
      {isLoggedIn && (
        <span>
          <Link
            css={currentPath !== '/my-problem' && unSelectedAnchor}
            href={'/my-problem'}
          >
            문제 출제
          </Link>
        </span>
      )}
    </div>
  );
}

export default Menu;
