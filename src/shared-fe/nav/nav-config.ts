import type { SvgIconComponent } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QuizIcon from "@mui/icons-material/Quiz";

export type NavItem = {
  key: string;
  href: string;
  icon: SvgIconComponent;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "nav.dashboard", href: "/dashboard", icon: DashboardIcon },
  { key: "nav.students", href: "/students", icon: PeopleAltIcon },
  { key: "nav.exams", href: "/exams", icon: QuizIcon },

];

export const DRAWER_WIDTH = 256;
