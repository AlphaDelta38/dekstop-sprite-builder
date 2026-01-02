'use client';

import { Box, Typography } from "@mui/material";
import TABS from "../../lib/constants/tabs";
import { usePathname, useRouter } from "next/navigation";

import styles from './layout.module.scss';

function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box className={styles.mainContainer}>
      <Box className={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Box className={styles.tabItemContainer} key={tab.id} onClick={() => router.push(tab.path)}>
              <tab.icon className={styles.tabItemIcon} style={{ color: isActive ? "#EDEDED" : "#9CA3AF" }} />
              <Typography className={styles.tabItemLabel} variant="h6" style={{ color: isActive ? "#EDEDED" : "#9CA3AF" }}>{tab.label}</Typography>
            </Box>
          )
        })}
      </Box>
      <Box className={styles.pageContainer}>
        {children}
      </Box>
    </Box>
  )
}

export default TabsLayout;
