import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allBuildings: [],
  buildingName: "",
  buildingData: null,
  currentClean: null,
  currentCleanData: null,
  drops: [],
  selectDropModal: false,
  dateModal: false,
  editDate: null,
  dropDate: null,
  currentDrop: null,
  cleans: null,
  building: null,
  cleanNames: null,
  isWeatherOK: true,
  fetchNewData: false,
  weatherForm: false,
  equipmentForm: false,
  latestWeatherInfo: null,
  selectedBuilding: "",
  refreshBuildingVersion: 0
};

const buildingSlice = createSlice({
  name: "buildingNames",
  initialState,
  reducers: {
    buildingsList(state, action) {
      state.allBuildings = action.payload.buildings;
    },
    setBuilding(state, action) {
      state.buildingName = action.payload.name;
      state.buildingData = action.payload.data;
      state.currentClean = action.payload.currentClean;
      state.currentCleanData = action.payload.currentCleanData;
      state.drops = action.payload.drops;
    },
    setSelectDropModal(state, action) {
      state.selectDropModal = !state.selectDropModal;
    },
    setDateModal(state, action) {
      state.dateModal = !state.dateModal;
    },
    setEditDate(state, action) {
      state.editDate = action.payload.editDate;
    },
    setDropDate(state, action) {
      state.dropDate = action.payload.dropDate;
    },
    setCurrentDrop(state, action) {
      state.currentDrop = action.payload.drop;
    },
    setCurrentClean(state, action) {
      state.currentClean = action.payload.clean;
    },
    setCleanNames(state, action) {
      state.cleanNames = action.payload.names;
    },
    setIsWeatherOK(state, action) {
      state.isWeatherOK = action.payload.isOK;
    },
    setFetchNewData(state, action) {
      state.fetchNewData = action.payload.fetchData;
    },
    setDrops(state, action) {
      state.drops = action.payload.drops;
    },
    setWeatherForm(state, action) {
      state.buildingData = { ...state.buildingData, weatherForm: action.payload }
    },
    setEquipmentForm(state, action) {
      state.buildingData = { ...state.buildingData, equipmentForm: action.payload }
    },
    setLatestWeatherInfo(state, action) {
      state.latestWeatherInfo = action.payload.latestWeather;
    },
    setLastDropCleanName(state, action) {
      state.buildingData = { ...state.buildingData, ...action.payload };
    },
    setSelectedBuilding(state, action) {
      state.selectedBuilding = action.payload.name;
    },
    setCurrentCleanData(state, action) {
      state.currentCleanData = action.payload.currentData;
    },
    setLiveStreaming(state, action) {
      state.buildingData = { ...state.buildingData, isLiveStreaming: action.payload }
    },
    setRefreshBuildingVersion(state, action) {
      state.refreshBuildingVersion = state.refreshBuildingVersion + 1
    }
  },
});

export const buildingListActions = buildingSlice.actions;

export default buildingSlice;
