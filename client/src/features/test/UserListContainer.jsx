import React, { useState, useEffect } from "react";
import UserList from "../components/UserList";

const UserListContainer = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		const response = await fetch("https://jsonplaceholder.typicode.com/users");
		const data = await response.json();
		setUsers(data);
		setLoading(false);
	};

	return <div>{loading ? <p>Loading...</p> : <UserList users={users} />}</div>;
};

export default UserListContainer;
