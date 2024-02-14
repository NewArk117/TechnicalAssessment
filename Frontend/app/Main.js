import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import LinearProgress from "@material-ui/core/LinearProgress"
import Axios from "axios"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material"
import { TablePagination } from "@material-ui/core"
import SearchBar from "material-ui-search-bar"
function Main() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [headers, setHeaders] = useState([])
  const [data, setData] = useState([])
  const [listData, setListData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searched, setSearched] = useState("")
  const [originalData, setOriginalData] = useState([])
  const [searchBy, setSearchBy] = useState("id") // Default search by "id"
  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (file) {
      const formData = new FormData()
      formData.append("file", file)

      // Read file content
      const reader = new FileReader()
      reader.onload = function (event) {
        const csvContent = event.target.result
        // Split the CSV content into rows
        const rows = csvContent.split("\n")
        // Extract headers from the first row
        const headers = rows[0].split(",")
        // Initialize an array to store the parsed data
        const data = []

        // Parse data skipping the first row (which contains headers)
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].split(",")
          // Create an object to represent each row of data
          const rowData = {}
          // Store each column value with its corresponding header
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = row[j]
          }
          // Add the row data object to the data array
          data.push(rowData)
        }
        setHeaders(headers)
        setData(data)
        sendData(headers, data)
        console.log("Headers:", headers)
        console.log("Data:", data)
      }
      reader.readAsText(file)
      // Simulating upload process
      setUploading(true)
      setTimeout(() => {
        // Simulate progress
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 10
          setProgress(Math.min(progress, 100))
          if (progress >= 100) {
            clearInterval(interval)
            getData()
            setUploading(false)
          }
        }, 200)
      }, 1000)
    }
    const sendData = async (headers, data) => {
      try {
        const response = await Axios.post(`http://localhost:8080/sendData`, { headers, data })
      } catch (error) {}
      // Here you can make your API call to upload the file using formData
      // For demonstration, we're simulating the upload process.
    }
  }
  const getData = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/getData`)
      console.log(response.data)
      setListData(response.data)
      setOriginalData(response.data)
    } catch (error) {}
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchByChange = event => {
    getData()
    setSearchBy(event.target.value)
  }

  const requestSearch = searchedVal => {
    if (searchedVal.trim() === "") {
      getData() // Call getData() when the search bar is empty
    } else {
      const filteredRows = originalData.filter(row => {
        // Check if the selected searchBy attribute exists and filter based on it
        return row[searchBy] && row[searchBy].toString().toLowerCase().includes(searchedVal.toLowerCase())
      })
      setListData(filteredRows)
    }
  }

  const cancelSearch = () => {
    setSearched("")
    requestSearch(searched)
    getData()
  }
  /*
  useEffect(() => {
    getData()
  }, [])*/
  return (
    <div>
      <div>
        <input accept=".csv" id="contained-button-file" type="file" style={{ display: "none" }} onChange={handleFileChange} />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Choose CSV File
          </Button>
        </label>
        {fileName && <Typography variant="body1">File Selected: {fileName}</Typography>} {/* Render file name */}
        <br />
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file || uploading}>
          Upload
        </Button>
        {uploading && <LinearProgress variant="determinate" value={progress} />}
        <SearchBar value={searched} onChange={searchVal => requestSearch(searchVal)} onCancelSearch={() => cancelSearch()} />
        <div>
          <label>Search By:</label>
          <select value={searchBy} onChange={handleSearchByChange}>
            <option value="id">ID</option>
            <option value="postId">Post ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="body">Body</option>
            {/* Add other options as needed */}
          </select>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>PostId</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Body</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0 ? listData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : listData).map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.postId}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.body}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={listData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
        </TableContainer>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)
