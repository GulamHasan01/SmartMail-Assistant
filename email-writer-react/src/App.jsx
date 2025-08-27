import { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import "./App.css";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateReply = async () => {
    if (!emailContent.trim()) {
      setError("Please enter email content.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });

      setGeneratedReply(typeof response.data === "string" ? response.data : JSON.stringify(response.data));  // backend returns reply text
    } catch (error) {
      setError("Failed to generate reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          placeholder="Paste your email content here..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </Box>

      <Box sx={{ mx: 3, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="tone-label">Tone (Optional)</InputLabel>
          <Select
            labelId="tone-label"
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mx: 3, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={loading || emailContent.trim() === ""}
          onClick={handleGenerateReply}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mx: 3, mb: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box
          sx={{
            mx: 3,
            mt: 3,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6">Generated Reply:</Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {generatedReply}
          </Typography>
          <Button variant="outlined" onClick={handleCopy} sx={{ mt: 1 }}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
