import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Card} from 'react-native-elements';

const ResourcesScreen = () => {
  const resources = [
    {
      title: 'Understanding Violence Against Women',
      description:
        'Learn about different forms of violence, including physical, sexual, and emotional abuse.',
      link: 'https://www.unwomen.org/en/what-we-do/ending-violence-against-women', // Example link
      color: '#E57373', // Light red
    },
    {
      title: 'Support Services and Hotlines',
      description:
        'Find contact information for local and national organizations that provide support to survivors of violence.',
      link: 'https://www.thehotline.org/', // Example link
      color: '#BA68C8', // Light purple
    },
    {
      title: 'Legal Rights and Resources',
      description:
        'Understand your legal rights and options if you have experienced violence.',
      link: 'https://www.rainn.org/', // Example link
      color: '#64B5F6', // Light blue
    },
    {
      title: 'Safety Planning and Prevention',
      description:
        'Create a safety plan to protect yourself and learn about strategies to prevent violence.',
      link: 'https://ncadv.org/get-help', // Example link
      color: '#4DB6AC', // Light teal
    },
    {
      title: 'Promoting Gender Equality',
      description:
        'Explore resources on promoting gender equality and challenging harmful social norms.',
      link: 'https://www.un.org/sustainabledevelopment/gender-equality/', // Example link
      color: '#81C784', // Light green
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {resources.map((resource, index) => (
        <Card
          key={index}
          containerStyle={[styles.card, {backgroundColor: resource.color}]}>
          <Card.Title style={styles.cardTitle}>{resource.title}</Card.Title>
          <Card.Divider />
          <Text style={styles.cardDescription}>{resource.description}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(resource.link)}>
            <Text style={styles.linkText}>Learn More</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    borderRadius: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', 
  },
  cardDescription: {
    marginBottom: 8,
    color: '#fff', 
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    alignSelf: 'flex-end', 
    color: '#fff', 
    fontWeight: 'bold',
  },
});

export default ResourcesScreen;
