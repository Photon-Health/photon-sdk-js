import { usePhotonSDK } from "@photonhealth/react";
import {
  Container,
  Flex,
  Text,
  List,
  ListItem,
  Button,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

function App() {
  const { isAuthenticated, login, logout, user, isLoading, getOrganizations } =
    usePhotonSDK();
  let organizations;
  let loading = false;
  if (isAuthenticated) {
    const orgs = getOrganizations();
    organizations = orgs.organizations;
    loading = orgs.loading;
  }

  return !isLoading ? (
    <Flex direction={"column"} justify={"center"}>
      <Container>
        <Text>
          User Authenticated: {isAuthenticated ? <CheckIcon /> : <CloseIcon />}
        </Text>
        {isAuthenticated ? (
          <Text mb="4">Organization (Red is currently logged in):</Text>
        ) : null}
        {!loading && isAuthenticated ? (
          <List>
            {organizations.map((x) => {
              return (
                <ListItem pl="8">
                  <Flex gap="4" align="center" maxW="50%" pb="2">
                    <Text
                      style={user?.org_id === x.id ? { color: "red" } : {}}
                      flex="1"
                    >
                      {x.name}
                    </Text>
                    {!user?.org_id ? (
                      <Button
                        colorScheme="blue"
                        justifySelf="flex-end"
                        onClick={() => login({ organizationId: x.id })}
                      >
                        Login
                      </Button>
                    ) : null}
                  </Flex>
                </ListItem>
              );
            })}
          </List>
        ) : null}
        {user ? <Text>User:</Text> : null}
        {user ? <Text pl="8">Name: {user.name}</Text> : null}
        {!isAuthenticated ? (
          <Button colorScheme="blue" mt="4" onClick={() => login()}>
            Login
          </Button>
        ) : (
          <Button mt="4" onClick={() => logout({})}>
            Logout
          </Button>
        )}
      </Container>
    </Flex>
  ) : (
    <Flex direction={"column"} justify={"center"}>
      <Container centerContent>
        <p>Loading...</p>
      </Container>
    </Flex>
  );
}

export default App;
