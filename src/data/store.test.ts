import { describe, it, expect } from 'vitest';
import { 
  addDress, 
  getDressById, 
  deleteDress, 
  getAllDresses, 
  validateDressData 
} from './store';

describe('Rania Boutique - In-Memory Store', () => {

  it('MANDATORY: validates bad data correctly', () => {
    // Attempt to validate a dress with a negative price and empty name
    const badDress = {
      name: "",
      price: -50,
      material: "Silk" as const,
      sizes: ["M" as const],
      stockQuantity: -5,
      description: "Too short",
      imageUrl: ""
    };

    const errors = validateDressData(badDress);
    
    // We expect it to catch the errors!
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('3 characters'))).toBe(true);
    expect(errors.some(e => e.includes('greater than 0'))).toBe(true);
  });

  it('MANDATORY: adds a valid dress to RAM', () => {
    const initialCount = getAllDresses().length;

    const validDress = {
      name: "Test Velvet Gown",
      price: 2500,
      material: "Satin" as const,
      sizes: ["S" as const, "M" as const],
      stockQuantity: 10,
      description: "A beautiful test gown with perfect dimensions.",
      imageUrl: "https://example.com/dress.jpg"
    };

    const newDress = addDress(validDress);

    // Ensure it returned an ID
    expect(newDress.id).toBeDefined();
    
    // Ensure the total count went up by 1
    const newCount = getAllDresses().length;
    expect(newCount).toBe(initialCount + 1);

    // Ensure we can fetch it by ID
    const fetched = getDressById(newDress.id);
    expect(fetched?.name).toBe("Test Velvet Gown");
  });

  it('MANDATORY: deletes a dress from RAM', () => {
    // First, add a dress specifically to delete
    const tempDress = addDress({
      name: "Delete Me",
      price: 100,
      material: "Cotton" as const,
      sizes: ["L" as const],
      stockQuantity: 1,
      description: "This dress will be deleted shortly.",
      imageUrl: ""
    });

    const idToDelete = tempDress.id;
    
    // Perform the deletion
    const isDeleted = deleteDress(idToDelete);
    expect(isDeleted).toBe(true);

    // Verify it is gone
    const fetched = getDressById(idToDelete);
    expect(fetched).toBeUndefined();
  });

});