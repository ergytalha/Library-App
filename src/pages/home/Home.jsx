import { Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        📖 Welcome to BookVault
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Your personal space to store, manage, and explore books effortlessly.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 5 }}
        component={Link}
        to="/books"
      >
        📚 View Book List
      </Button>
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Why BookVault?
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h5">📔 Personal Library</Typography>
              <Typography color="textSecondary">
                Organize your favorite books in a single place, accessible anytime.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h5">🔍 Find & Categorize</Typography>
              <Typography color="textSecondary">
                Tag books with categories and find what you need in seconds.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h5">📅 Track Reading Status</Typography>
              <Typography color="textSecondary">
                Mark books as "Read", "Currently Reading" or "Want to Read".
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h5" component="h3" sx={{ mt: 5 }}>
        Ready to build your ultimate book collection?
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
        component={Link}
        to="/books"
      >
        ➕ Add Your First Book
      </Button>
    </Container>
  );
};

export default Home;
