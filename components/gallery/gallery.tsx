import React, { useState } from "react";
import styles from "../../styles/gallery.module.scss";

// Mock data for featured historical items
const FEATURED_ITEMS = [
    { id: "Q1", label: "Giza Necropolis", year: -2560, description: "The oldest and largest of the three pyramids in the Giza pyramid complex.", image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg" },
    { id: "Q2", label: "Mona Lisa", year: 1503, description: "A portrait painting by Leonardo da Vinci, described as the best known work of art in the world.", image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg" },
    { id: "Q3", label: "Moon Landing", year: 1969, description: "The first manned mission to land on the Moon, led by Neil Armstrong and Buzz Aldrin.", image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Aldrin_69.jpg" },
    { id: "Q4", label: "The Great Wall of China", year: -221, description: "A series of fortifications that were built across the historical northern borders of ancient Chinese states.", image: "https://upload.wikimedia.org/wikipedia/commons/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg" },
    { id: "Q5", label: "Albert Einstein", year: 1879, description: "A world-renowned physicist who developed the theory of relativity.", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg" },
    { id: "Q6", label: "Eiffel Tower", year: 1887, description: "A wrought-iron lattice tower on the Champ de Mars in Paris, France.", image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg" },
];

export default function Gallery() {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    return (
        <div className={styles.galleryContainer}>
            <header className={styles.header}>
                <h1>WIKI GALLERY</h1>
                <p>Explore the museum of human history</p>
            </header>

            <div className={styles.grid}>
                {FEATURED_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className={styles.pioneerCard}
                        onClick={() => setSelectedItem(item)}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.label} />
                            <div className={styles.overlay}>
                                <span>{item.year < 0 ? `${Math.abs(item.year)} BCE` : item.year}</span>
                            </div>
                        </div>
                        <div className={styles.info}>
                            <h3>{item.label}</h3>
                            <p>{item.description.substring(0, 60)}...</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedItem && (
                <div className={styles.modal} onClick={() => setSelectedItem(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.close} onClick={() => setSelectedItem(null)}>&times;</button>
                        <img src={selectedItem.image} alt={selectedItem.label} />
                        <div className={styles.modalData}>
                            <h2>{selectedItem.label}</h2>
                            <span className={styles.yearHighlight}>
                                {selectedItem.year < 0 ? `${Math.abs(selectedItem.year)} BCE` : selectedItem.year}
                            </span>
                            <p>{selectedItem.description}</p>
                            <a
                                href={`https://www.wikidata.org/wiki/${selectedItem.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.wikiLink}
                            >
                                View on Wikidata
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
