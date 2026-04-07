const VideoSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 flex justify-center">
        <video
          className="w-full max-w-4xl rounded-lg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/brand-video.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default VideoSection;
