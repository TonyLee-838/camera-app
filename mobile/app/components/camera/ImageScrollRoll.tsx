import React, { useState } from 'react';
import {
  GestureResponderEvent,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';

import colors from '../../config/colors';
import { PredictedImage } from '../../types/index';
import ExpandedImage from './ExpandedImage';

interface ImageScrollRollProps {
  images: PredictedImage[];
  onSelectImage: (imageName: string) => void;
}

function ImageScrollRoll({ images, onSelectImage }: ImageScrollRollProps) {
  const [expandedImageUrl, setExpandedImageUrl] = useState<string>(null!);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [locationX, setLocationX] = useState<number>(0);

  const handleExpandImage = (e: GestureResponderEvent, url: string) => {
    setLocationX(e.nativeEvent.pageX);
    setExpandedImageUrl(url);
    setIsExpanded(true);
  };

  const handleRelease = (imageName: string) => {
    if (!isExpanded) onSelectImage(imageName);

    setIsExpanded(false);
    setTimeout(() => {
      setExpandedImageUrl(null);
    }, 250);
  };

  return (
    <>
      <ExpandedImage expanded={isExpanded} imageUrl={expandedImageUrl} locationX={locationX} />
      <View style={styles.container}>
        <Text style={styles.text}>根据您的场景，为您推荐以下几张照片：</Text>
        <ScrollView horizontal={true}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={image.name}
              onLongPress={(e) => handleExpandImage(e, image.url)}
              delayLongPress={300}
              onPressOut={() => handleRelease(image.name)}
            >
              <Image
                source={{ uri: image.url }}
                style={styles.image}
                key={image.name}
                borderRadius={10}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '17%',
    minHeight: 110,
    backgroundColor: colors.white,
  },
  cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
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
  imageContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInside: {
    width: '80%',
    resizeMode: 'contain',
    height: '80%',
    opacity: 1,
    borderRadius: 15,
  },
});

export default ImageScrollRoll;
