import React, { useRef, useState } from 'react'
import styles from './ProductGallery.module.scss'
import Image from 'next/image'

interface Props {
  images: string[]
}

const ProductGallery = ({ images }: Props) => {

  const imageRefs = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length; // Wrap to start if at end
      scrollToActiveImage(newIndex);
      return newIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + images.length) % images.length; // Wrap to end if at start
      scrollToActiveImage(newIndex);
      return newIndex;
    });
  };

  const scrollToActiveImage = (index: number) => {
    if (imageRefs.current[index]) {
      //@ts-ignore
      imageRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <div className={styles.images}>
      <div className={styles.cover}>
        {
          images.length > 1 &&
          <div className={styles.nav}>
            <div onClick={handlePrev}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </div>
            <div onClick={handleNext}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        }
        <Image
          alt={''}
          src={images[currentIndex]}
          fill
        />
      </div>
      <div className={styles.secondary}>
        {
          images.map((image, index) => (
            <div
              style={{
                opacity: currentIndex === index ? 0.5 : 1
              }}
              //@ts-ignore
              ref={(el) => (imageRefs.current[index] = el)}
              onClick={() => {
                setCurrentIndex(index)
                scrollToActiveImage(index)
              }}
              key={image} className={styles.image}>
              <Image
                alt={''}
                src={image}
                layout='fill'
                objectFit='contain'
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ProductGallery