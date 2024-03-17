const { fetchRecommendations } = require('./script');
const createWidget = require('./script.js'); 



describe('fetchRecommendations', () => {
  // Mock fetch function
  global.fetch = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
  });

  test('should construct the correct fetch URL', async () => {
    // Define the expected URL based on your parameters
    const expectedURL = 'http://localhost:8080/http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?publisher=taboola-templates&app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&source.id=214321562187&source.type=video&rec.count=30';

    // Call the fetch function
    await fetchRecommendations();

    // Verify that fetch was called with the expected URL
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedURL);
  });
});

describe('createWidget function', () => {
    let recommendation;
  
    beforeEach(() => {
      recommendation = {
        thumbnail: [{ url: 'https://example.com/image.jpg' }],
        name: 'Test Recommendation',
        description: 'Test description',
        url: 'https://example.com/article',
        origin: 'Test Origin'
      };
    });
  
    afterEach(() => {
      recommendation = null;
    });
  
    it('should create a widget container with image, description, and read more button', () => {
      const widget = createWidget(recommendation);
  
      expect(widget).toBeDefined();
      expect(widget.classList.contains('widget')).toBe(true);
  
      const image = widget.querySelector('img');
      expect(image).toBeDefined();
      expect(image.src).toBe(recommendation.thumbnail[0].url);
      expect(image.alt).toBe(recommendation.name);
  
      const description = widget.querySelector('p');
      expect(description).toBeDefined();
      expect(description.textContent).toBe(recommendation.description);
  
      const readMoreButton = widget.querySelector('button');
      expect(readMoreButton).toBeDefined();
      expect(readMoreButton.textContent).toBe('Read More');
  
      // Simulate click event on read more button
      const openArticle = jest.fn();
      readMoreButton.click();
      expect(openArticle).toHaveBeenCalledWith(recommendation.url, recommendation.origin);
    });
  });
  
