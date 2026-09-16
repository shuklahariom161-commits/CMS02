import { Request, Response } from 'express';
import { serverFacultyList } from '../data/mitsFacultyData.js';

export const getFaculty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, designation, search } = req.query;
    let results = [...serverFacultyList];

    if (department && department !== 'All' && department !== 'All Departments') {
      results = results.filter(
        (f) => f.department.toLowerCase() === (department as string).toLowerCase()
      );
    }

    if (designation && designation !== 'All' && designation !== 'All Designations') {
      const des = (designation as string).toLowerCase();
      results = results.filter((f) => f.designation.toLowerCase().includes(des));
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.specialization.some((s) => s.toLowerCase().includes(q)) ||
          f.cabin.toLowerCase().includes(q) ||
          (f.advisedClubs && f.advisedClubs.some((c) => c.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFacultyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const faculty = serverFacultyList.find((f) => f.id === id);

    if (!faculty) {
      res.status(404).json({ success: false, message: 'Faculty member not found' });
      return;
    }

    res.json({ success: true, data: faculty });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
