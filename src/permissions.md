  // const setRoles = async () => {
  //   try {
  //     // Get all permissions for 'project' and 'user' entities
  //     const permissionsQuery = query(
  //       collection(db, 'Permissions'),
  //       where('entity', 'in', ['project', 'user'])
  //     );
  //     const permissionsSnapshot = await getDocs(permissionsQuery);
  //     if (!permissionsSnapshot.empty) {
  //       const allPermissions = permissionsSnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
  //       // Define role-specific permissions
  //       const adminPermissions = allPermissions.map(p => p.id);
  //       const managerPermissions = allPermissions
  //         .filter(p => ['create', 'read'].includes(p.operation))
  //         .map(p => p.id);
  //       const employeePermissions = allPermissions
  //         .filter(p => p.operation === 'read')
  //         .map(p => p.id);
  //       // Update Admin role
  //       const adminQuery = query(collection(db, 'Roles'), where('roleName', '==', 'SuperAdmin'));
  //       const adminSnapshot = await getDocs(adminQuery);
  //       if (!adminSnapshot.empty) {
  //         adminSnapshot.docs.forEach(async (d) => {
  //           await updateDoc(doc(db, 'Roles', d.id), { permissions: adminPermissions });
  //         });
  //       }
  //       // Update Manager role
  //       const managerQuery = query(collection(db, 'Roles'), where('roleName', '==', 'Admin'));
  //       const managerSnapshot = await getDocs(managerQuery);
  //       if (!managerSnapshot.empty) {
  //         managerSnapshot.docs.forEach(async (d) => {
  //           await updateDoc(doc(db, 'Roles', d.id), { permissions: managerPermissions });
  //         });
  //       }
  //       // Update Employee role
  //       const employeeQuery = query(collection(db, 'Roles'), where('roleName', '==', 'Employee'));
  //       const employeeSnapshot = await getDocs(employeeQuery);
  //       if (!employeeSnapshot.empty) {
  //         employeeSnapshot.docs.forEach(async (d) => {
  //           await updateDoc(doc(db, 'Roles', d.id), { permissions: employeePermissions });
  //         });
  //       }
  //       console.log('Roles updated successfully');
  //     }
  //   } catch (err) {
  //     console.error('Error updating roles:', err);
  //   }
  // };
  // useEffect(()=>{
  //   setRoles()
  // },[])