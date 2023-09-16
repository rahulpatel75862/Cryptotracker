import styled from '@emotion/styled';
import { Container, Typography } from '@mui/material';
import React from 'react';
import Caraousel from './Caraousel';

const BannerContainer = styled('div')({
  backgroundImage: "url(./banner2.jpg)",
});

const BannerContent = styled('div')({
  height: 400,
  display: "flex",
  flexDirection: "column",
  paddingTop: 16, // Use a numerical value for spacing
  justifyContent: "space-around",
});

const Tagline = styled('div')({
  display: "flex",
  height: "40%",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
});

const Banner = () => {
  return (
    <BannerContainer>
      <Container component={BannerContent}>
        <Tagline>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              fontFamily: "Montserrat",
            }}
          >
            Crypto Tracker
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "darkgrey",
              textTransform: "capitalize",
              fontFamily: "Montserrat",
            }}
          >
            Get all the Info regarding your favorite Crypto Currency
          </Typography>
        </Tagline>
        <Caraousel />
      </Container>
    </BannerContainer>
  );
}

export default Banner;
