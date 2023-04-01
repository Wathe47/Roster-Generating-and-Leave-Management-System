import React, { Component } from 'react';
import { Paper, Button, Grid, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem, Select, InputLabel, FormControl} from '@mui/material';
import { motion } from 'framer-motion';
//import { Link } from 'react-router-dom';


class About extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      startDate: '',
      endDate: '',
      anchorEl: null,
      jobPosition: '',
      selectedName: [],
      names: ["John", "Mary", "Bob"]
      
    };

    this.handleCreateNewRoster = this.handleCreateNewRoster.bind(this);
    this.handleEditRoster = this.handleEditRoster.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleJobPositionClick = this.handleJobPositionClick.bind(this);
    this.handleJobPositionClose = this.handleJobPositionClose.bind(this);
    this.handleJobPositionSelect = this.handleJobPositionSelect.bind(this);
    
  }

  handleCreateNewRoster() {
    // Handle logic for creating new roster
  }

  handleEditRoster() {
    // Handle logic for editing roster
  }

  handleStartDateChange(event) {
    this.setState({ startDate: event.target.value });
  }

  handleEndDateChange(event) {
    this.setState({ endDate: event.target.value });
  }

  
  handleJobPositionClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleJobPositionClose() {
    this.setState({ anchorEl: null });
  }

  handleJobPositionSelect(event) {
    this.setState({ jobPosition: event.target.innerText });
    this.handleJobPositionClose();
  }

  handleNameChange = (event) => {
    const { names } = this.state;
    const selectedName = event.target.value;
    const newSelectedNames = names.filter(name => name !== selectedName);
    this.setState({ selectedName: [...this.state.selectedName, selectedName], names: newSelectedNames });
  };

  

  render() {
    const { anchorEl } = this.state;
    const { selectedName, names } = this.state;
    return (
        <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom style ={{marginTop:'35px',fontSize:'27px',marginLeft:'20px',fontWeight:'700',color:'#888888'}}>
              ADMIN_ROSTER
            </Typography>
            {/* Add form fields here */}
          </Grid>
        
      <Paper style={{marginLeft:'20px',marginTop:'45px',height:'160px',marginRight:'20px',background:'#F6FFF3'}}>
      <Grid container spacing={3}>
          <Grid item xs={12} className="roster--grid">
  
            <Button variant="contained" color="primary" onClick={this.handleCreateNewRoster} style={{marginLeft:'25px',marginTop:'15px'}}>
              Create 
            </Button>

            <div className='roster--button'>  
            <Button variant="contained" color="primary" onClick={this.handleEditRoster} className='roster--button'>
              Edit 
            </Button>
            </div>
            <div className='roster--duration'>
            <TextField 
              id="start-date"
              label="Select Start Date"
              type="date"
              value={this.state.startDate}
              onChange={this.handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField 
              id="end-date"
              label="Select End Date"
              type="date"
              value={this.state.endDate}
              onChange={this.handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              
            />
            </div>




          </Grid>
        </Grid>
      </Paper>
      
      <Paper style={{ marginLeft: '20px', marginTop: '45px', marginRight: '20px',marginBottom:'45px' }}>
          <TableContainer component={Paper} style={{background:'#F6FFF3'}}>
            <Table style={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={6}>
                  <div style={{textAlign:'center'}} >
                  <TextField label=" Start Date-End Date " size="small"/>
                  </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ borderTop: 'none', borderBottom: 'none',width: '25%' }}>
        <div>
        <Button
          aria-controls="job-position-menu"
          aria-haspopup="true"
          onClick={this.handleJobPositionClick}
          color="success"
          variant="contained"

        >
          {this.state.jobPosition ? this.state.jobPosition : 'Job Position'}
        </Button>
        <Menu
          id="job-position-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleJobPositionClose}
          
        >
          <MenuItem onClick={this.handleJobPositionSelect}>Junior SE</MenuItem>
          <MenuItem onClick={this.handleJobPositionSelect}>Senior SE</MenuItem>
          <MenuItem onClick={this.handleJobPositionSelect}>QA</MenuItem>
        </Menu>
      </div>
      </TableCell>
      

                  <TableCell><Button variant="contained" color="inherit" onClick={this.handleEditRoster} >Monday
            </Button></TableCell>
                  <TableCell><Button variant="contained" color="inherit" onClick={this.handleEditRoster} >Tuesday
            </Button></TableCell>
                  <TableCell><Button variant="contained" color="inherit" onClick={this.handleEditRoster} >Wednesday 
            </Button></TableCell>
                  <TableCell><Button variant="contained" color="inherit" onClick={this.handleEditRoster} >Thursday
            </Button></TableCell>
                  <TableCell><Button variant="contained" color="inherit" onClick={this.handleEditRoster} >Friday 
            </Button></TableCell>
                  </TableRow>
                  </TableHead>

                  <TableBody>
                  
                  {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: '25%' ,border:'0px' }}></TableCell>
              {[...Array(5)].map((_, dayIndex) => (
                <TableCell key={dayIndex} style={{border:'5px'}}>            
                <TextField sx={{width: '150px'}} size="small"/>
            </TableCell>
              ))}
            </TableRow>
          ))}

                  </TableBody>
                  </Table>
                  </TableContainer>
                  </Paper>
                  <div className='admin-roster--devider'></div>

                  <Paper style={{ marginLeft: '20px', marginTop: '45px', marginRight: '20px',marginBottom:'45px',paddingLeft:'20px',paddingBottom:'8px',background:'#F6FFF3' }}>
                  <div>
        {selectedName.length > 0 && (
          <div>
            <ul>
              {selectedName.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
        <p>Work from home staff:</p>
        <FormControl>
          <InputLabel id="name-label">Name</InputLabel>
          <Select
            labelId="name-label"
            id="name"
            value={selectedName}
            onChange={this.handleNameChange}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        {selectedName.length > 0 && (
          <div>
            <ul>
              {selectedName.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
        <p>Work from home staff:</p>
        <FormControl>
          <InputLabel id="name-label">Name</InputLabel>
          <Select
            labelId="name-label"
            id="name"
            value={selectedName}
            onChange={this.handleNameChange}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
                  </Paper>
      </motion.div>
    );
  }
}

export default About;