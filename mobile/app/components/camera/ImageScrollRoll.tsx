import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import colors from '../../config/colors';
import { PredictedImage } from '../../types/index'

interface ImageScrollRollProps{
  images: PredictedImage[];
  style: object;
  onSelectImage:(e:Event, imageName:string)=>void
}

function ImageScrollRoll({ images, style, onSelectImage }: ImageScrollRollProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>根据您的场景，为您推荐以下几张照片：</Text>
      <ScrollView horizontal={true} contentOffset={{x:5,y:10}}>
        {images.map((image) => (
          <TouchableOpacity key={image.name} onPress={(e) => onSelectImage(e, image.name)}>
            <Image source={{ uri: image.url }} style={styles.image} key={image.name} borderRadius={10} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 110,
    backgroundColor: colors.white,
  },
  text: {
    color: colors.medium,
    marginVertical: 10,
    marginLeft: 10,
  },
  image: {
    height: 80,
    width: 80,
    resizeMode: 'stretch',
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default ImageScrollRoll;
