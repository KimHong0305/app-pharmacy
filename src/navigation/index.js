import {navAdmin, navEmployee, navNurse} from './allNav';

export const getNav = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
      return navAdmin;
    case 'ROLE_EMPLOYEE':
      return navEmployee;
    case 'ROLE_NURSE':
      return navNurse;
    default:
      return [];
  }
};
