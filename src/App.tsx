import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        AI Color Pallete Generator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const defaultTheme = createTheme();

export default function App() {
  const [colorSeason, setColorSeason] = React.useState('');
  const determineColorSeason = async (
    skinTone: FormDataEntryValue | null,
    eyeColor: FormDataEntryValue | null,
    hairColor: FormDataEntryValue | null
  ) => {
    console.log('Calling the OpenAI API');
    const systemMessage = {
      role: 'system',
      content: `You will be provided with a person's skin tone, eye color, and hair color. Your task is to determine their color season in terms of Spring, Fall, Summer, Winter. Then you must determine which colors suit them and which colors they should avoid, format your response as follows and use emojis as much as possible: "Season: Spring, Fall, Summer, Winter", "You should wear: [list of colors that suit them]", "You should avoid: [list of colors that don't suit them]".`
    };
    const userMessage = {
      role: 'user',
      content: `Skin tone: ${skinTone}, Eye color: ${eyeColor}, Hair color: ${hairColor}`
    };

    const APIBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, userMessage],
      temperature: 0,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    };
    try {
      const data = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(APIBody)
      });
      return data.json();
    } catch (error) {
      console.error('Error determining color season:', error);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const colorPallete = {
      skinColor: data.get('color1'),
      eyeColor: data.get('color2'),
      hairColor: data.get('color3')
    };
    const colorSeason = await determineColorSeason(
      colorPallete.skinColor,
      colorPallete.eyeColor,
      colorPallete.hairColor
    );
    setColorSeason(colorSeason.choices[0].message.content);
    console.log(
      'Your color season is:',
      colorSeason.choices[0].message.content
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            AI Color Pallete Generator
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="color1"
              label="Color 1 Skin"
              name="color1"
              autoComplete="Color 1"
              inputProps={{ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' }}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="color2"
              label="Color 2 Eyes"
              name="color2"
              autoComplete="Color 2"
              inputProps={{ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' }}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="color3"
              label="Color 3 Hair"
              name="color3"
              autoComplete="Color 3"
              inputProps={{ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' }}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Generate Pallete
            </Button>
            <Grid container>
              <Typography component="h1" variant="h5">
                {colorSeason
                  ? colorSeason
                  : 'Your color season will appear here'}
              </Typography>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </L ink>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
