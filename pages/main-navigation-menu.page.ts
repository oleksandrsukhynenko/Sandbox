import { MainNavigationMenuActions } from './main-navigation-menu.actions';

export const Sections = {
	Forms: 'Forms',
	BookStore: 'Book Store Application',
} as const;

export const Links = {
	PracticeForm: 'Practice Form',
	BookStore: 'Book Store',
	Login: 'Login',
	Profile: 'Profile',
} as const;

export class MainNavigationMenu extends MainNavigationMenuActions {}