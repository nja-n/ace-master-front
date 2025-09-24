import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  const faqs = [
    {
      question: "What is AceMaster?",
      answer:
        "AceMaster is a free online multiplayer card & puzzle game where you can play matches, challenge friends, and climb the leaderboard."
    },
    {
      question: "Do I need to create an account?",
      answer:
        "You can play as a guest, but creating an account lets you save progress, earn rewards, and access leaderboards."
    },
    {
      question: "Is AceMaster free to play?",
      answer:
        "Yes! AceMaster is completely free to play. Optional premium features may be added in the future."
    },
    {
      question: "Can I play with my friends?",
      answer:
        "Yes! You can create room matches and invite your friends to play together."
    }
  ];
  const plays = [
    {
      question: "Clear Your Cards!",
      answer:
        "The main objective is to clear your hand of all cards as quickly as possible."
    },
    {
      question: "Suit and Strike!",
      answer:
        `Each round has an active suit (♣, ♦, ♥, ♠). Play cards in sequence. If you don’t have one, perform a <b>Strike (break the suit/flow)</b> – play another suit.
          In this case, the player with the highest card takes the pile.`
    },
    {
      question: "Next Round",
      answer: `Player with the highest card of a round chooses the next suit.`
    },
    {
      question: "Donkey",
      answer:
        `The last player holding cards at the end is the
          <b> Kazhutha (Donkey) 🐴</b>.`
    },
    {
      question: "Card Power",
      answer:
        `2–10 = low to high | J=11th, Q=12th, K=13th, A=14th. <b>Ace</b> is highest and <b>2</b> is lowest`
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2 }}
        color="white"
      >
        How To Play
      </Typography>

      <Box>
        {plays.map((faq, i) => (
          <Accordion key={i} sx={{ mb: 2, bgcolor: "#1c1c1c", color: "white" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                component="div"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2, mt: 2 }}
        color="white"
      >
        Frequently Asked Questions
      </Typography>

      <Box>
        {faqs.map((faq, i) => (
          <Accordion key={i} sx={{ mb: 2, bgcolor: "#1c1c1c", color: "white" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
