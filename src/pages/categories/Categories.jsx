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

const apiUrl = import.meta.env.VITE_BASE_URL;

const Categories = () => {
  const [modalOpen, setModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [formData, setFormData] = useState({ name: "", description: "" }); // Form verileri
  const [editData, setEditData] = useState(null);  // Düzenlenen kategori verisi
  const [categories, setCategories] = useState([]); // Kategori listesi
  const [actionType, setActionType] = useState(null); // Gerçekleştirilen işlem türü (ekleme, güncelleme, silme)
  const [error, setError] = useState(null); // Hata mesajı

  // Modal açma/kapama fonksiyonları
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(null);
    setError("");
  };

  // Component mount edildiğinde kategorileri getir
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/v1/categories`)
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories.");
      });
  }, []);

  // Kategori ekleme/güncelleme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editData
      ? `${apiUrl}/api/v1/categories/${editData.id}`
      : `${apiUrl}/api/v1/categories`;
    const request = editData ? axios.put(url, formData) : axios.post(url, formData);

    request
      .then((response) => {
        const data = response.data;
        if (editData) {
          setCategories(categories.map((c) => (c.id === editData.id ? data : c)));
          setActionType("update");
          setEditData(null);
        } else {
          setCategories([...categories, data]);
          setActionType("add");
        }
        setFormData({ name: "", description: "" });
        handleOpenModal();
      })
      .catch((error) => {
        console.error("Error saving category:", error);
        setError("An error occurred while registering a category.");
      });
  };

  // Kategori düzenleme işlemi
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
    });
    setEditData(category);
  };

  // Kategori silme işlemi
  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/api/v1/categories/${id}`)
      .then(() => {
        setCategories(categories.filter((c) => c.id !== id));
        setActionType("delete");
        handleOpenModal();
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        setError("An error occurred while deleting the category.");
      });
  };

  return (
    <Container>
      <Typography pt={3} variant="h3" gutterBottom>
        Categories
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Button type="submit" variant="contained" color="primary">
            {editData ? "Update" : "Add"}
          </Button>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Category List:
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} divider>
            <ListItemText
              primary={category.name}
              secondary={
                <Typography variant="body2" color="textSecondary">
                  Description: {category.description}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(category)} color="primary">
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(category.id)} color="error">
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
        message={`The category has been successfully ${actionType}.`}
      />
    </Container>
  );
};

export default Categories;
