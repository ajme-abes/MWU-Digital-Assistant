import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import VpnKeyRoundedIcon  from '@mui/icons-material/VpnKeyRounded';
import { SitemarkIcon } from './CustomIcons';
import AnimatedText from './AnimatedText';

const items = [
  {
    icon: <RocketLaunchRoundedIcon sx={{ color: 'blue' }} />,
    title: 'Unlock Efficiency',
    description:
      'Get instant access to essential university information.',
  },
  {
    icon: <MenuBookRoundedIcon sx={{ color: 'blue' }} />,
    title: ' Seamless Learning Experience',
    description:
      'Browse study materials and resources with ease.',
  },
  {
    icon: <SmartToyRoundedIcon sx={{ color: 'brown' }} />,
    title: 'AI-Powered Assistance',
    description:
      'Have your questions answered anytime, anywhere.',
  },
  {
    icon: <EditNoteRoundedIcon sx={{ color: 'blue' }} />,
    title: ' Hassle-Free Exams and Assignments',
    description:
      'Take online tests and track your progress effortlessly.',
  },
  {
    icon: <VpnKeyRoundedIcon sx={{ color: 'blue' }} />,
    title: ' Hassle-Free Exams and Assignments',
    description:
      'Take online tests and track your progress effortlessly.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450, mt: -25  }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }} >
       {/*<SitemarkIcon />*/}
       <AnimatedText />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 1 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}