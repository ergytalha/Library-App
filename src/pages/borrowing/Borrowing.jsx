import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Modal from "../../components/Modal";

const apiUrl = import.meta.env.VITE_BASE_URL;

const Borrowing = () => {
  const [modalOpen, setModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [formData, setFormData] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    returnDate: "",
    bookId: "",
  });
  const [editData, setEditData] = useState(null); // Düzenlenen ödünç alma kaydı
  const [borrowings, setBorrowings] = useState([]); // Ödünç alma kayıtları
  const [books, setBooks] = useState([]); // Kitap listesi
  const [actionType, setActionType] = useState(null); // Gerçekleştirilen işlem türü (ekleme, güncelleme, silme)
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(null);
    setErrorMessage("");
  };

  // Component mount edildiğinde kitapları ve ödünç alma kayıtlarını çek
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/v1/books`)
      .then((response) => setBooks(response.data))
      .catch(() => setErrorMessage("Error loading books"));

    axios
      .get(`${apiUrl}/api/v1/borrows`)
      .then((response) => setBorrowings(response.data))
      .catch(() => setErrorMessage("Error loading borrow records"));
  }, []);

  // Form submit işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const returnDate = formData.returnDate || formData.borrowingDate;

    const requestData = {
      borrowerName: formData.borrowerName,
      borrowerMail: formData.borrowerMail,
      borrowingDate: formData.borrowingDate,
      returnDate: returnDate, 
      bookForBorrowingRequest: { id: formData.bookId },
    };

    const url = editData
      ? `${apiUrl}/api/v1/borrows/${editData.id}`
      : `${apiUrl}/api/v1/borrows`;

    try {
      let response;
      if (editData) {
        response = await axios.put(url, requestData);
        setBorrowings(
          borrowings.map((b) => (b.id === editData.id ? response.data : b))
        );
        setEditData(null);
        setActionType("update");
      } else {
        response = await axios.post(url, requestData);
        setBorrowings([...borrowings, response.data]);
        setActionType("add");
      }

      handleOpenModal();
      setFormData({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: "",
        returnDate: "",
        bookId: "",
      });
    } catch (error) {
      setErrorMessage("Error processing borrowing");
    }
  };

  // Ödünç alma kaydını düzenleme
  const handleEdit = (borrowing) => {
    setEditData(borrowing);
    setFormData({
      borrowerName: borrowing.borrowerName,
      borrowerMail: borrowing.borrowerMail,
      borrowingDate: borrowing.borrowingDate
        ? borrowing.borrowingDate.split("T")[0]
        : "",
      returnDate: borrowing.returnDate ? borrowing.returnDate.split("T")[0] : "",
      bookId: borrowing.book?.id || "",
    });
  };

  // Ödünç alma kaydını silme
  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/api/v1/borrows/${id}`)
      .then(() => {
        setBorrowings(borrowings.filter((b) => b.id !== id));
        setActionType("delete");
        handleOpenModal();
      })
      .catch(() => setErrorMessage("Error deleting record"));
  };

  return (
    <Container>
      <Typography variant="h4" pt={3} gutterBottom>
        Borrowing
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Name"
            fullWidth
            margin="normal"
            value={formData.borrowerName}
            onChange={(e) =>
              setFormData({ ...formData, borrowerName: e.target.value })
            }
            required
          />
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            value={formData.borrowerMail}
            onChange={(e) =>
              setFormData({ ...formData, borrowerMail: e.target.value })
            }
            required
          />
          <TextField
            label="Borrow Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.borrowingDate}
            onChange={(e) =>
              setFormData({ ...formData, borrowingDate: e.target.value })
            }
            required
          />
          <TextField
            label="Return Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.returnDate}
            onChange={(e) =>
              setFormData({ ...formData, returnDate: e.target.value })
            }
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Choose Book</InputLabel>
            <Select
              value={formData.bookId}
              onChange={(e) =>
                setFormData({ ...formData, bookId: e.target.value })
              }
              required
            >
              {books.map((book) => (
                <MenuItem key={book.id} value={book.id}>
                  {book.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            {editData ? "Update" : "Add"}
          </Button>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Borrow List:
      </Typography>
      <List>
        {borrowings.map((borrowing) => (
          <ListItem key={borrowing.id} divider>
            <ListItemText
              primary={borrowing.borrowerName}
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Book: {borrowing.book?.name || "No book"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Borrow Date:{" "}
                    {borrowing.borrowingDate
                      ? borrowing.borrowingDate.split("T")[0]
                      : ""}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Return Date: {borrowing.returnDate}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    E-mail: {borrowing.borrowerMail}
                  </Typography>
                </>
              }
            />

            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEdit(borrowing)}
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(borrowing.id)}
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
            ? "Update Successful"
            : actionType === "delete"
            ? "Deletion Successful"
            : "Add Successful"
        }
        message={
          actionType === "update"
            ? "Borrowing has been successfully updated!"
            : actionType === "delete"
            ? "Borrowing successfully deleted!"
            : "Borrowing successfully added!"
        }
      />
    </Container>
  );
};

export default Borrowing;