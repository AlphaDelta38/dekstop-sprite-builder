import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import  HomeIcon  from "@mui/icons-material/Home";
import DescriptionIcon from '@mui/icons-material/Description';

interface Tab {
  id: string;
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  path: string;
}

const TABS: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    path: '/',
  },
  {
    id: 'uploaded-files',
    label: 'Uploaded Files',
    icon: DescriptionIcon,
    path: '/uploaded-files',
  },
];

export default TABS;