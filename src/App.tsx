import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ColorLensIcon from '@mui/icons-material/ColorLens';
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
  function parseColorSeason(colorSeason: string) {
    console.log('Color Season:', colorSeason);
    const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

    const suitablePart = colorSeason.split('You should avoid:')[0];
    const avoidPart = colorSeason.split('You should avoid:')[1];

    const suitableColors = suitablePart.match(hexColorRegex) || [];
    const avoidColors = avoidPart ? avoidPart.match(hexColorRegex) || [] : [];

    console.log('Suitable Colors:', suitableColors);
    console.log('Avoid Colors:', avoidColors);
    return (
      <div>
        <Typography component="h2" variant="h5">
          Suitable Colors:
        </Typography>
        <div style={{ display: 'flex' }}>
          {suitableColors.map(color => (
            <div
              key={color}
              style={{
                backgroundColor: color,
                width: '50px',
                height: '50px',
                margin: '2px',
                borderRadius: '50%'
              }}
            />
          ))}
        </div>
        <Divider />
        <Typography component="h2" variant="h5">
          Avoid Colors:
        </Typography>
        <div style={{ display: 'flex' }}>
          {avoidColors.map(color => (
            <div
              key={color}
              style={{
                backgroundColor: color,
                width: '50px',
                height: '50px',
                margin: '2px',
                borderRadius: '50%'
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  const determineColorSeason = async (
    skinTone: FormDataEntryValue | null,
    eyeColor: FormDataEntryValue | null,
    hairColor: FormDataEntryValue | null
  ) => {
    console.log('Calling the OpenAI API');
    const systemMessage = {
      role: 'system',
      content: `You will be provided with a person's skin tone, eye color, and hair color. Your task is to determine their color season in terms of Spring, Fall, Summer, Winter. Then you must determine which hexcolors suit them and which hex colors along with their names they should avoid please ensure at least 4 colors of each, format your the response with the 3 section as follows and use emojis as much as possible,: "Your color season is [Season]", "You should wear: [list of colors that suit them]", "You should avoid: [list of colors that don't suit them]".`
    };
    const userMessage = {
      role: 'user',
      content: `Skin tone: ${skinTone}, Eye color: ${eyeColor}, Hair color: ${hairColor}`
    };
    console.log('OpenAI Message:', [systemMessage, userMessage]);
    const APIBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, userMessage],
      temperature: 0.5,
      max_tokens: 100,
      top_p: 0.9,
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
      console.log('OpenAI Response:', data);
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
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <ColorLensIcon />
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
              <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
                Color Analysis:
              </Typography>

              <Typography component="h2" variant="h6" sx={{ mt: 1 }}>
                {colorSeason
                  ? `${colorSeason}`
                  : ' Add Colors and Press Button'}
              </Typography>
              {colorSeason && <div>{parseColorSeason(colorSeason)}</div>}

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
