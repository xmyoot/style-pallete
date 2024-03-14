import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        AI Color Pallete Generator
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
async function determineColorSeason(
  skinTone: FormDataEntryValue | null,
  eyeColor: FormDataEntryValue | null,
  hairColor: FormDataEntryValue | null
) {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "human",
        "My skin tone is {skinTone} my eyes are {eyeColor} and my hair is {hairColor} which color pallete am I in term of Spring, Winter, Summer, and Fall"
      ]
    ]);
    console.log(1, prompt);
    const model = new ChatOpenAI({});
    console.log(2, model);
    const outputParser = new StringOutputParser();
    console.log(3, outputParser);
    const chain = prompt.pipe(model).pipe(outputParser);
    console.log(4, chain);
    const response = await chain.invoke({
      skinTone: skinTone,
      eyeColor: eyeColor,
      hairColor: hairColor
    });
    console.log(response);
  } catch {
    throw new Error("Function not implemented.");
  }
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function App() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const colorPallete = {
      skinColor: data.get("color1"),
      eyeColor: data.get("color2"),
      hairColor: data.get("color3")
    };
    const colorSeason = await determineColorSeason(
      colorPallete.skinColor,
      colorPallete.eyeColor,
      colorPallete.hairColor
    );
    console.log("Your color season is:", colorSeason);
    // const suitableColors = suggestColors(colorSeason);
    // const colorsToAvoid = suggestColorsToAvoid(colorSeason);

    // console.log({ colorSeason, suitableColors, colorsToAvoid });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
              inputProps={{ pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }}
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
              inputProps={{ pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }}
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
              inputProps={{ pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }}
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
