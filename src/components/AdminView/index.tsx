import React, { useState } from 'react'
import {
    AppBar,
    Tabs,
    Tab,
    ThemeProvider,
    Box
} from '@material-ui/core'

import CultureView from './components/CultureView'
import ProblemView from './components/ProblemView'
import MedicineView from './components/MedicineView'

import theme from '../theme'

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`admin-tabpanel-${index}`}
        aria-labelledby={`admin-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {props.children}
          </Box>
        )}
      </div>
    );
}

const tabProps = (index: any) => ({
      id: `admin-tab-${index}`,
      'aria-controls': `admin-tabpanel-${index}`,
    })

export default function AdminView(props: any) {
    
    const [value, setValue]: [number, any] = useState(0)
    
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }
    
    return (
        <div className="view d-flex flex-column">
            <ThemeProvider theme={theme}>
                <AppBar position="static">
                <Tabs value={value} onChange={handleChange} TabIndicatorProps={{
                    style: {
                        height: '4px'
                    }
                }}>
                    <Tab label="Препарати" {...tabProps(0)} />
                    <Tab label="Проблеми"  {...tabProps(1)} />
                    <Tab label="Культури"  {...tabProps(2)} />
                </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <MedicineView />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ProblemView />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <CultureView />
                </TabPanel>
            </ThemeProvider>
        </div>
    )
}