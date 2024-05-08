import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'
import path from 'path';
import fs from 'fs';

const directoryPath = path.join(__dirname, '../../components/student');
const fileNames = fs.readdirSync(directoryPath).filter(fileName => fileName.endsWith('.jsx'));

describe('Rendering components', () => {
  let components = {};

  beforeAll(async () => {
    // Import all components before running the tests
    const importPromises = fileNames.map(fileName => 
      import(`../../components/student/${fileName}`).then(module => {
        const componentName = fileName.replace('.jsx', '');
        components[componentName] = module.default;
      })
    );

    await Promise.all(importPromises);
  });

  test('imports all components', () => {
    // Check if all components are imported
    expect(Object.keys(components)).toEqual(fileNames.map(fileName => fileName.replace('.jsx', '')));
  });

  // For each component, create a test
  fileNames.forEach(fileName => {
    const componentName = fileName.replace('.jsx', '');
    it(`renders ${componentName}`, () => {
      // Render the component
      const history = createMemoryHistory()
      render(
        <Router history={history}>
          {components[componentName]}
        </Router>
      );

      // Add your assertions here
      const element = document.querySelectorAll("div");
      expect(element.length).toBeGreaterThan(0);
    });
  });
});