import { Share } from 'react-native';

export const generateCSV = async (reportData: any[]): Promise<string> => {
  if (reportData.length === 0) return '';
  
  const headers = Object.keys(reportData[0]).join(',');
  const rows = reportData.map(row => 
    Object.values(row).map(val => `"${val}"`).join(',')
  ).join('\n');
  
  return `${headers}\n${rows}`;
};

export const generatePDF = async (reportData: any[]): Promise<string> => {
  // requires react-native-html-to-pdf
  // For the sake of the mock, we pretend to generate a PDF path
  console.log('Generating PDF for data', reportData);
  return 'file:///mock_path/report.pdf';
};

export const exportViaShareAPI = async (content: string, isFile: boolean = false) => {
  try {
    if (isFile) {
      await Share.share({
        url: content, // On iOS, this shares the file. On Android it varies.
        title: 'Khayr App Report'
      });
    } else {
      await Share.share({
        message: content,
        title: 'Khayr App CSV Data'
      });
    }
  } catch (error) {
    console.error('Error sharing', error);
  }
};
