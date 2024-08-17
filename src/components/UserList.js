import React, { Component } from 'react';
import { View, Text } from 'react-native';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await fetch('http://10.254.251.185:3000/users/');
      const jsonData = await response.json();
      this.setState({ users: jsonData, loading: false });
      console.log(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { users, loading } = this.state;

    return (
      <View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          users.map((user) => (
            <View key={user.id}>
              <Text>Name: {user.name}</Text>
              <Text>Email: {user.email}</Text>
              <Text>Username: {user.username}</Text>
              <Text>Phone: {user.phone}</Text>
              <Text>Website: {user.website}</Text>
              <Text>-------------------</Text>
            </View>
          ))
        )}
      </View>
    );
  }
}

export default UserList;
