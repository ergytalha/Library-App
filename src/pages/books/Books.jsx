import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

const Books = () => {
  const [modalOpen, setModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [formData, setFormData] = useState({
    title: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    publisherId: "",
    categoryId: "",
  });
  const [editData, setEditData] = useState(null); // Düzenlenen kitap verisi
  const [books, setBooks] = useState([]); // Kitap listesi
  const [authors, setAuthors] = useState([]); // Yazar listesi
  const [publishers, setPublishers] = useState([]); // Yayınevi listesi
  const [categories, setCategories] = useState([]); // Kategori listesi
  const [actionType, setActionType] = useState(null); // Gerçekleştirilen işlem türü (ekleme, güncelleme, silme)
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı

  // Modal'ı kapat
  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(null);
    setErrorMessage("");
  };

  // Component mount edildiğinde verileri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, authorsRes, publishersRes, categoriesRes] =
          await Promise.all([
            axios.get(`${apiUrl}/api/v1/books`),
            axios.get(`${apiUrl}/api/v1/authors`),
            axios.get(`${apiUrl}/api/v1/publishers`),
            axios.get(`${apiUrl}/api/v1/categories`),
          ]);
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
        setCategories(categoriesRes.data);
      } catch {
        setErrorMessage("An error occurred while loading data.");
      }
    };
    fetchData();
  }, []);

  // Form submit işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editData
      ? `${apiUrl}/api/v1/books/${editData.id}`
      : `${apiUrl}/api/v1/books`;

    try {
      const payload = {
        name: formData.title,
        publicationYear: parseInt(formData.publicationYear),
        stock: parseInt(formData.stock),
        author: { id: formData.authorId },
        publisher: { id: formData.publisherId },
        categories: [{ id: parseInt(formData.categoryId) }],
      };

      let response;
      if (editData) {
        response = await axios.put(url, payload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      const newBook = response.data;
      if (!editData) {
        setBooks([...books, newBook]);
      } else {
        setBooks(books.map((book) => (book.id === newBook.id ? newBook : book)));
      }

      setActionType(editData ? "update" : "add");
      setEditData(null);
      setModalOpen(true);
      setFormData({
        title: "",
        publicationYear: "",
        stock: "",
        authorId: "",
        publisherId: "",
        categoryId: "",
      });
    } catch {
      setErrorMessage("An error occurred while saving the book.");
    }
  };

  // Kitap silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/books/${id}`);
      setBooks(books.filter((b) => b.id !== id));
      setActionType("delete");
      setModalOpen(true);
    } catch {
      setErrorMessage("An error occurred while deleting the book.");
    }
  };

  // Kitap düzenleme işlemi
  const handleEdit = (book) => {
    setEditData(book);
    setFormData({
      title: book.name,
      publicationYear: book.publicationYear.toString(),
      stock: book.stock.toString(),
      authorId: book.author?.id || "",
      publisherId: book.publisher?.id || "",
      categoryId:
        book.categories && book.categories.length > 0
          ? book.categories[0].id.toString()
          : "",
    });
  };

  return (
    <Container>
      <Typography pt={3} variant="h3" gutterBottom>
        Books
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Book Name"
            fullWidth
            margin="normal"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Publication Year"
            type="number"
            fullWidth
            margin="normal"
            required
            value={formData.publicationYear}
            onChange={(e) =>
              setFormData({ ...formData, publicationYear: e.target.value })
            }
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            margin="normal"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Author</InputLabel>
            <Select
              value={formData.authorId}
              required
              onChange={(e) =>
                setFormData({ ...formData, authorId: e.target.value })
              }
            >
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Publisher</InputLabel>
            <Select
              value={formData.publisherId}
              required
              onChange={(e) =>
                setFormData({ ...formData, publisherId: e.target.value })
              }
            >
              {publishers.map((publisher) => (
                <MenuItem key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.categoryId}
              required
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            {editData ? "Update" : "Add"}
          </Button>
        </form>
      </Paper>
      <List>
        {books.map((book) => (
          <ListItem key={book.id} divider>
            <ListItemText
              primary={book.name}
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Author: {book.author?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Publication Year: {book.publicationYear}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stock: {book.stock}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Publisher: {book.publisher?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Categories:{" "}
                    {book.categories && book.categories.length > 0
                      ? book.categories.map((cat) => cat.name).join(", ")
                      : "None"}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEdit(book)}
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(book.id)}
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
        message={`The book has been successfully ${actionType}.`}
      />
    </Container>
  );
};

export default Books;