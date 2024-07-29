// import { useState } from 'react';
import ThemePicker from 'components/Header/ThemePicker/ThemePicker';
import { HeaderWrapper, UserWrapper } from './Header.styled';
import UserBlock from './UserBlock/UserBlock';
import BurgerMenu from './BurgerMenu/BurgerMenu';

const Header = () => {
  return (
    <HeaderWrapper>
      <BurgerMenu />
      <UserWrapper>
        <ThemePicker />
        <UserBlock />
      </UserWrapper>
    </HeaderWrapper>
  );
};

export default Header;
