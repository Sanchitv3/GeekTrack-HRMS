import { createSlice } from "@reduxjs/toolkit";
export interface PermissionType {
  id: string;
  name: string;
  entity: string;
  operation: string;
}
const initialState: { permissionData: PermissionType[] } = {
  permissionData: [],
};
export const Permission = createSlice({
  name: "Permission",
  initialState,
  reducers: {
    upatePermissions: (state, action) => {
      state.permissionData = action.payload;
      console.log('action.payload in permissions: ', action.payload)
    },
  },
});
export const { upatePermissions } = Permission.actions;
export default Permission.reducer;