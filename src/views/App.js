import * as React from "react";
import { findRouteBFS, findRouteDijkstra } from "../utils/findRoute";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Map from "../components/Map";
import Logo from "../assets/logo.svg";
import { loadCities } from "../utils/loadCities";
import { COLORS } from "../assets/colors";
import UseRadioGroup from "../components/RadioGroup";
import LatencyLabel from "../assets/latencyLabel.svg";
import "./App.css";

function App() {
  const [initialNetwork, setInitialNetwork] = React.useState(0);
  const [finalNetwork, setFinalNetwork] = React.useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState("BFS");
  const cities = loadCities();
  const networkGraph = require("../data/graph.json");

  function changeWanLatency(currentLatency) {
    return (currentLatency + 1) % 4;
  }

  React.useEffect(() => {
    const colors = [COLORS.green, COLORS.yellow, COLORS.orange, COLORS.red];

    document.querySelectorAll(`circle[class="WAN"]`).forEach((el) =>
      el.addEventListener(
        "click",
        function () {
          var currentLatency = el.getAttribute("latency");
          currentLatency = changeWanLatency(
            parseInt(currentLatency)
          ).toString();
          el.setAttribute("latency", currentLatency);
          el.style.fill = colors[currentLatency];
          networkGraph.find(
            (elGraph) => elGraph.name === el.getAttribute("id")
          ).latency = parseInt(currentLatency);
          // console.log(
          //   networkGraph.find(
          //     (elGraph) => elGraph.name === el.getAttribute("id")
          //   )
          // );
        },
        false
      )
    );
  }, []);

  const handleRedeInicial = (e, newValue) => {
    setInitialNetwork(newValue.id);
    // console.log(e);
  };

  const handleRedeFinal = (e, newValue) => {
    setFinalNetwork(newValue.id);
    // console.log(e);
  };

  const whatAlgorithm = () => {
    if (selectedAlgorithm === "BFS") {
      return findRouteBFS(initialNetwork, finalNetwork, networkGraph);
    }
    return findRouteDijkstra(initialNetwork, finalNetwork, networkGraph);
  };

  const handlePesquisa = () => {
    const spottedRoute = whatAlgorithm();
    changeRouteColor(spottedRoute);
  };

  function changeRouteColor(newRoute) {
    document
      .querySelectorAll(`line[class="connection"]`)
      .forEach((el) => (el.style.stroke = COLORS.oceanblueWAN));
    let latency = 0;

    for (let aux = 0; aux < newRoute.length - 1; aux++) {
      let connection = [newRoute[aux], newRoute[aux + 1]];
      connection = connection.sort();

      if (
        networkGraph.find((elGraph) => elGraph.name === newRoute[aux + 1])
          .latency
      ) {
        const latencyConection = networkGraph.find(
          (elGraph) => elGraph.name === newRoute[aux + 1]
        ).latency + 1;
        latency += latencyConection * 100;
        // console.log(latencyConection + latency)
      }

      setTimeout(() => {
        document.querySelector(
          `line[id="${connection[0] + "-" + connection[1]}"]`
        ).style.stroke = COLORS.orangelight;
      }, latency);
    }
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid item xs={2.5}>
          <Card
            variant="outlined"
            sx={{
              height: "fill-available",
              alignItems: "center",
              backgroundColor: COLORS.beige,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                height: "30%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              <img src={Logo} alt="Logo" height="80%" />
            </Box>
            <Typography
              sx={{ fontSize: 16 }}
              color="black"
              variant="h4"
              textAlign={"center"}
              margin={"5%"}
            >
              Selecione a rede inicial e a rede destino para encontrar o menor
              caminho.
            </Typography>
            <Autocomplete
              disablePortal
              options={cities}
              getOptionLabel={(cities) => cities.name}
              sx={{ marginTop: "10%", width: "80%" }}
              renderInput={(params) => (
                <TextField {...params} label="Rede Inicial" />
              )}
              onChange={handleRedeInicial}
            />
            <Autocomplete
              disablePortal
              options={cities}
              getOptionLabel={(cities) => cities.name}
              sx={{ marginTop: "10%", marginBottom: "10%", width: "80%" }}
              renderInput={(params) => (
                <TextField {...params} label="Rede Destino" />
              )}
              onChange={handleRedeFinal}
            />
            <UseRadioGroup
              callbackValue={(value) => setSelectedAlgorithm(value)}
            />
            <Button
              variant="contained"
              endIcon={<SearchIcon />}
              sx={{ marginTop: "10%", width: "80%" }}
              onClick={handlePesquisa}
            >
              Encontrar
            </Button>
          </Card>
        </Grid>
        <Grid item xs={9.5}>
          <Box sx={{ height: "100%" }}>
            <Grid sx={{ height: "100%" }}>
              <Grid
                item
                xs={12}
                alignSelf={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  backgroundColor: COLORS.lightgrey,
                }}
              >
                <Map />
                <Box
                  sx={{
                    width: "auto",
                    height: "auto",
                    bottom: 0,
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                  }}
                >
                  <img src={LatencyLabel} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
