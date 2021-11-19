import { Container, createTheme, LinearProgress, TableContainer, TextField, Table, TableHead, TableRow , TableCell, Tab, TableBody, makeStyles } from '@material-ui/core';
import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react'
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { ThemeProvider } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

const CoinsTable = () => {
    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(false);
    const { currency, symbol }= CryptoState();

    const [search, setSearch] = useState("");
    const history= useHistory();

    const fetchcoins= async () =>{
        setLoading(true)
        const { data } = await axios.get(CoinList(currency));
        setCoins(data);
        setLoading(false)
    }
    console.log(coins);

    useEffect(() => {
        fetchcoins();
    }, [currency])


    const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
          },
          type: "dark",
        },
      });

      const handlesearch= ()=>{
          return coins.filter( (coin)=>
          coin.name.toLowerCase().includes(search) ||
          coin.symbol.toLowerCase().inclues(search)
          )
      }

      const useStyles= makeStyles(() => ({

      }));

      const classes= useStyles();


    return (
        <ThemeProvider theme={darkTheme}>
         <Container style={{ textAlign: "center" }}>

         <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>

        <TextField label= "Search for a crypto-currency" variant="outlined" 
         style={{width:"100%", marginBottom:20}}
         onChange={(e)=>setSearch(e.target.value)}
         />

         <TableContainer>
             {
                 loading?(
                     <LinearProgress style= {{backgroundColor: "gold"}} />
                 ) : (
                     <Table>
                       <TableHead style={{ backgroundColor: "#EEBC1D" }} >
                        <TableRow>
                        {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                        </TableRow>
                       </TableHead>

                         <TableBody >
                           {handlesearch().map(row =>{
                               const profit= row.price_change_percentage>0;

                               return(
                                <TableRow
                                onClick={() => history.push(`/coins/${row.id}`)}
                                className={classes.row}
                                key={row.name}
                                >

                              <TableCell
                                component="th"
                                scope="row"
                                style={{
                                display: "flex",
                                gap: 15,
                              }}
                             >
                              <img
                             src={row?.image}
                             alt={row.name}
                             height="50"
                             style={{ marginBottom: 10 }}
                             />
                             <div
                              style={{ display: "flex", flexDirection: "column" }}
                             >
                             <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                             >
                              {row.symbol}
                             </span>
                             <span style={{ color: "darkgrey" }}>
                              {row.name}
                             </span>
                             </div>
                             </TableCell>


                            <TableCell align="right">
                               {symbol}{" "}
                               {numberWithCommas(row.current_price.toFixed(2))}
                              </TableCell>

                              <TableCell
                                align="right"
                                style={{
                                color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                fontWeight: 500,
                               }}
                             >
                             {profit && "+"}
                             {row.price_change_percentage_24h.toFixed(2)}%
                             </TableCell>


                             <TableCell align="right">
                                {symbol}{" "}
                               {numberWithCommas(
                                row.market_cap.toString().slice(0, -6)
                                )}
                              M
                             </TableCell>
                              
                        

                                </TableRow>
                               )

                           })}
                         </TableBody>
                     </Table>
                 )
             }
         </TableContainer>

         </Container>
        </ThemeProvider>
    )
}

export default CoinsTable
