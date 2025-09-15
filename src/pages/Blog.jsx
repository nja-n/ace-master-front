import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "AceMaster Launches 🚀",
      date: "Sept 2025",
      excerpt: "We are excited to announce the official launch of AceMaster, a multiplayer card & puzzle game!",
      link: "/blog/launch"
    },
    {
      id: 2,
      title: "Tips to Win in AceMaster 🏆",
      date: "Sept 2025",
      excerpt: "Want to climb the leaderboard? Here are some pro tips to improve your strategy in AceMaster.",
      link: "/blog/tips"
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">AceMaster Blog</h1>
      {posts.map((post) => (
        <Card key={post.id} className="mb-6 shadow-lg rounded-2xl">
          <CardContent>
            <Typography variant="h5" className="font-bold">{post.title}</Typography>
            <Typography variant="caption" color="gray">{post.date}</Typography>
            <Typography variant="body1" className="mt-2">{post.excerpt}</Typography>
            <Button href={post.link} variant="outlined" sx={{ mt: 2 }}>
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Blog;
