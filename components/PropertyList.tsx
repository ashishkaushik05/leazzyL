import React from 'react';
import { StyleSheet, FlatList, View as RNView } from 'react-native';
import PropertyCard, { PropertyType } from './PropertyCard';
import { Text } from './Themed';

// Dummy property data that mimics the design from the image
const dummyProperties: PropertyType[] = [
  {
    id: '1',
    price: 10592,
    title: 'Pinewood Heights',
    location: 'Aerocity',
    bhk: '2 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    amenities: ['Television', 'Wifi', 'AC', 'Refrigerator']
  },
  {
    id: '2',
    price: 10592,
    title: 'Pinewood Heights',
    location: 'Aerocity',
    bhk: '2 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    amenities: ['Television', 'Wifi']
  },
  {
    id: '3',
    price: 15000,
    title: 'Maple Residency',
    location: 'Near Kharar area',
    bhk: '3 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    amenities: ['Television', 'Wifi', 'AC', 'Parking']
  },
  {
    id: '4',
    price: 8500,
    title: 'Cedar Apartments',
    location: 'Downtown',
    bhk: '1 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    amenities: ['Television', 'Wifi', 'Washing Machine']
  }
];

type SectionProps = {
  title: string;
  properties: PropertyType[];
}

export function PropertySection({ title, properties }: SectionProps) {
  return (
    <RNView style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PropertyCard property={item} />}
        showsVerticalScrollIndicator={false}
      />
    </RNView>
  );
}

export default function PropertyList() {
  return (
    <RNView style={styles.container}>
      {/* First section: What we found for you */}
      <PropertySection title="What we found for you" properties={dummyProperties.slice(0, 2)} />
      
      {/* Second section: Near Kharar area */}
      <PropertySection title="Near Kharar area" properties={dummyProperties.slice(2)} />
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  }
});
