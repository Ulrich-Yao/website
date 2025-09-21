'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

export default function VideoTest() {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div>
            {/* Bouton d’ouverture */}
            <button
                onClick={() => setShowVideo(true)}
                className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-8 text-center transition z-40 overflow-hidden"
            >
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>

                {/* Icône Play */}
                <Play className="h-20 w-20 text-white mx-auto mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-12 relative z-10" />

                {/* Texte */}
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                    Cliquez pour regarder la vidéo
                </h3>
                <p className="text-white mb-6 relative z-10">
                    Découvrez Peak Gift en vidéo
                </p>
            </button>

            {/* Popup vidéo */}
            {showVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative bg-black rounded-lg overflow-hidden w-[90%] md:w-[800px]">
                        {/* Bouton fermeture */}
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Vidéo locale */}
                        <video className="w-full h-[400px] md:h-[500px]" controls autoPlay>
                            <source src="/videos/demo.mp4" type="video/mp4" />
                            Votre navigateur ne supporte pas la vidéo.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}
