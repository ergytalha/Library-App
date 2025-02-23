import { useState, useEffect } from "react";
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
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

const Publishers = () => {
  const [modalOpen, setModalOpen] = useState(false); // / Modal açık/kapalı durumu
  const [formData, setFormData] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  }); // Form verileri
  const [editData, setEditData] = useState(null); // Düzenlenen yayıncı verisi
  const [publishers, setPublishers] = useState([]); // Yayıncı listesi
  const [actionType, setActionType] = useState(null); // Gerçekleştirilen işlem türü (ekleme, güncelleme, silme)
  const [error, setError] = useState(""); // Hata mesajı

  // Modal açma/kapama fonksiyonları
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(null);
    setError("");
  };

  // Component mount edildiğinde yayıncı verilerini getir
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/v1/publishers`)
      .then((response) => {
        setPublishers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching publishers:", error);
        setError("Error fetching publishers.");
      });
  }, []);

  // Yayıncı ekleme veya güncelleme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editData
      ? `${apiUrl}/api/v1/publishers/${editData.id}`
      : `${apiUrl}/api/v1/publishers`;
    const method = editData ? axios.put : axios.post;

    method(url, formData)
      .then((response) => {
        if (editData) {
          setPublishers(
            publishers.map((p) => (p.id === editData.id ? response.data : p))
          );
          setEditData(null);
          setActionType("update");
        } else {
          setPublishers([...publishers, response.data]);
          setActionType("add");
        }
        setFormData({ name: "", establishmentYear: "", address: "" });
        handleOpenModal();
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred while registering a publisher.");
      });
  };

  // Yayıncı düzenleme işlemi: Formu doldur
  const handleEdit = (publisher) => {
    setFormData({
      name: publisher.name,
      establishmentYear: publisher.establishmentYear,
      address: publisher.address,
    });
    setEditData(publisher);
  };

  // Yayıncı silme işlemi
  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/api/v1/publishers/${id}`)
      .then(() => {
        setPublishers(publishers.filter((p) => p.id !== id));
        setActionType("delete");
        handleOpenModal();
      })
      .catch((error) => {
        console.error("Error deleting publisher:", error);
        setError("An error occurred while deleting the publisher.");
      });
  };

  return (
    <Container>
      <Typography pt={3} variant="h3" gutterBottom>
        Publishers
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Publisher Name"
            fullWidth
            margin="normal"
            required
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <TextField
            label="Establishment Year"
            type="number"
            fullWidth
            margin="normal"
            required
            value={formData.establishmentYear}
            onChange={(e) =>
              setFormData({ ...formData, establishmentYear: e.target.value })
            }
          />
          <TextField
            label="Address"
            type="text"
            fullWidth
            margin="normal"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <Button type="submit" variant="contained" color="primary">
            {editData ? "Update" : "Add"}
          </Button>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Publisher List:
      </Typography>
      <List>
        {publishers.map((publisher) => (
          <ListItem key={publisher.id} divider>
            <ListItemText
              primary={publisher.name}
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Establishment Year: {publisher.establishmentYear}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Address: {publisher.address}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEdit(publisher)}
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(publisher.id)}
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
        message={`The publisher has been successfully ${actionType}.`}
      />
    </Container>
  );
};

export default Publishers;
