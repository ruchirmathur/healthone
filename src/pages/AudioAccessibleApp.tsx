import React from 'react';
import { Box, IconButton, Typography, Paper, Fade } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SearchIcon from '@mui/icons-material/Search';

const WHITE_GRADIENT = "linear-gradient(135deg, #ffffff 0%, #f0f0f5 100%)";

const AudioHealthcareSearchWhite: React.FC = () => {
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [transcript, setTranscript] = React.useState<string>('');

  const handleMicClick = () => {
    setIsListening((prev) => !prev);

    if (!isListening) {
      setTranscript('');
      console.log('Listening...');
    } else {
      setTranscript('Find cardiologists near me');
      console.log('Stopped listening.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: WHITE_GRADIENT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Fade in>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: '32px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: { xs: '90vw', sm: 400 },
            maxWidth: 500,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <SearchIcon sx={{ color: '#6b7280', fontSize: 36 }} />
            <Typography
              variant="h4"
              sx={{
                color: '#374151',
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              Healthcare Audio Search
            </Typography>
          </Box>
          <IconButton
            aria-label={isListening ? "Stop Listening" : "Start Listening"}
            onClick={handleMicClick}
            sx={{
              background: isListening
                ? "linear-gradient(135deg, #f87171 0%, #fca5a5 100%)"
                : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
              color: '#374151',
              width: 100,
              height: 100,
              borderRadius: '50%',
              boxShadow: '0 8px 20px rgba(199, 210, 254, 0.4)',
              mb: 2,
              transition: 'transform 0.2s',
              transform: isListening ? 'scale(1.1)' : 'scale(1)',
              '&:hover': {
                background: isListening
                  ? "linear-gradient(135deg, #ef4444 0%, #fbbf24 100%)"
                  : "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)",
                color: '#1f2937',
                transform: 'scale(1.15)',
              },
            }}
          >
            {isListening ? <MicOffIcon fontSize="large" /> : <MicIcon fontSize="large" />}
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              color: isListening ? '#f87171' : '#374151',
              fontWeight: 500,
              mb: 2,
              minHeight: 24,
              transition: 'color 0.2s',
            }}
          >
            {isListening ? 'Listening... Speak your healthcare query.' : 'Tap the mic and ask, e.g., "Find a pediatrician nearby"'}
          </Typography>
          <Fade in={!!transcript}>
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                fontWeight: 600,
                fontSize: '1.1rem',
                minHeight: 40,
                textAlign: 'center',
              }}
            >
              {transcript}
            </Paper>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AudioHealthcareSearchWhite;
