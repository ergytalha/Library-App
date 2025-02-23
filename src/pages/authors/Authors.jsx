import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Modal from "../../components/Modal";

// API URL
const apiUrl = import.meta.env.VITE_BASE_URL;

const Authors = () => {
  const [modalOpen, setModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [error, setError] = useState(null); // Hata mesajı
  const [formData, setFormData] = useState({ name: "", birthDate: "", country: "" }); // Form verileri
  const [editData, setEditData] = useState(null); // Düzenlenen yazar verisi
  const [authors, setAuthors] = useState([]); // Yazar listesi
  const [actionType, setActionType] = useState(null); // Gerçekleştirilen işlem türü (ekleme, güncelleme, silme)

  // Modal'ı kapat
  const handleCloseModal = () => {
    setModalOpen(false);
    setError(null);
  };

  // Component mount edildiğinde yazarları getir
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/v1/authors`)
      .then((response) => {
        setAuthors(response.data);
        setError(null);
      })
      .catch((error) => setError(error.message));
  }, []);

  // Form submit işlemi
  const handleSubmit = (e) => {
    e.preventDefault();

    // Gerekli alanların doldurulup doldurulmadığını kontrol et
    if (!formData.name || !formData.birthDate || !formData.country) {
      setError("All fields are required.");
      return;
    }

    // Düzenleme veya ekleme işlemi için URL belirle
    const url = editData
      ? `${apiUrl}/api/v1/authors/${editData.id}`
      : `${apiUrl}/api/v1/authors`;

    // Düzenleme ve ekleme işlemi  
    const request = editData
      ? axios.put(url, formData)
      : axios.post(url, formData);

    request
      .then((response) => {
        const data = response.data;
        if (editData) {
          setAuthors(authors.map((a) => (a.id === editData.id ? data : a)));
          setEditData(null);
          setActionType("update");
        } else {
          setAuthors([...authors, data]);
          setActionType("add");
        }
        setModalOpen(true);
        setFormData({ name: "", birthDate: "", country: "" });
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setError(error.message);
      });
  };

  // Yazar düzenleme 
  const handleEdit = (author) => {
    setEditData(author);
    setFormData({
      name: author.name,
      birthDate: author.birthDate,
      country: author.country,
    });
  };

  // Yazar silme 
  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/api/v1/authors/${id}`)
      .then(() => {
        setAuthors(authors.filter((a) => a.id !== id));
        setError(null);
        setActionType("delete");
        setModalOpen(true);
      })
      .catch((error) => setError(error.message));
  };

  return (
    <Container>
      <Typography pt={3} variant="h3" gutterBottom>
        Authors
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Author Name"
            fullWidth
            margin="normal"
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Birth Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          />
          <TextField
            label="Country"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />

          <Button type="submit" variant="contained" color="primary">
            {editData ? "Update" : "Add"}
          </Button>
        </form>
      </Paper>

      <List>
        {authors.map((author) => (
          <ListItem key={author.id} divider>
            <ListItemText
              primary={`${author.name} - ${author.birthDate} - ${author.country}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEdit(author)}
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(author.id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
          actionType === "update"
            ? "Updated"
            : actionType === "delete"
            ? "Deleted"
            : "Added"
        }
        message={`The author has been successfully ${actionType}.`}
      />
    </Container>
  );
};

export default Authors;