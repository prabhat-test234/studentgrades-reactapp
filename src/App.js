import './App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from 'react';
import { getData } from "./dataService";
import { CircularProgress } from '@material-ui/core';

function App() {
  const [classAssignments, setClassAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myMap, setMyMap] = useState(new Map());
  let ras = new Map();
  useEffect(() => {
    let mounted = true;
    getData().then(data => {
      if(mounted) {
        setClassAssignments(data.clsassignments)
        // console.log(data)
        arrayToMap(data.gradedata)
        // console.log(myMap)
        if(myMap.size > 0) {
          setLoading(false)
        }
      }
    })
    return () => mounted = false;
  }, [])

  const arrayToMap = (value) => {
    // console.log(value)
    value.map(key => {
      setMyMap(myMap.set(key.studentid, {studentName: key.studentName, grades: key.grades}))
    })
  }

  return loading ? <CircularProgress/> :
    <div className="App">
      <header className="App-header">
        Student Grades Report
      </header>
      <TableContainer component={Paper}>
                <Table className="table" size="small" aria-label="a dense table">
                    <TableHead >
                        <TableRow className="table_header">
                          <TableCell>Student Name</TableCell>
                          {classAssignments.map(item => {
                          return <TableCell key={item.sectionid}>{item.sectionname}</TableCell>
                          })}              
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                      {[...myMap] && [...myMap.keys()].map(val => {
                       return <TableRow key={val}>
                              <TableCell component="th" scope="row">
                                  {myMap.get(val).studentName}
                              </TableCell>
                              {classAssignments.map(item => {
                                return <TableCell  key={item.sectionid}>
                               {myMap.get(val).grades.map(key => {
                                 key.sectionid === item.sectionid && ras.set(key.sectionid, key.gradePer)
                                })}
                                {ras.get(item.sectionid) ? ras.get(item.sectionid) :"0%"}
                                </TableCell>
                              })}
                        </TableRow>
                      })}     
                    </TableBody>
                </Table>
            </TableContainer>
    </div>
}

export default App;
