import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2 }}
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
