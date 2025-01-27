const vision = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');

// クライアントの初期化
const client = new vision.ImageAnnotatorClient();

async function detectTextForAllImages(inputDir, outputPath) {
    try {
        // `inputDir` 内のすべてのファイルを取得
        const files = fs.readdirSync(inputDir);

        console.log(`フォルダ内の画像を処理します: ${files.join(', ')}`);
        let combinedText = '';

        // 各ファイルに対してOCRを実行
        for (const file of files) {
            const filePath = path.join(inputDir, file);
            console.log(`処理中: ${filePath}`);

            try {
                const [result] = await client.textDetection(filePath);
                const detections = result.textAnnotations;

                if (detections.length > 0) {
                    const fullText = detections[0].description;
                    combinedText += `\n--- ${file} ---\n${fullText}\n`;
                } else {
                    console.log(`文字が検出されませんでした: ${filePath}`);
                }
            } catch (err) {
                console.error(`エラーが発生しました (${filePath}):`, err);
            }
        }

        // 全ての結果をまとめてファイルに保存
        fs.writeFileSync(outputPath, combinedText, 'utf8');
        console.log(`すべてのOCR結果を ${outputPath} に保存しました！`);
    } catch (error) {
        console.error('エラー:', error);
    }
}

// 使用例
const inputDir = './input'; // 入力画像が格納されているフォルダ
const outputPath = './output-text.txt'; // OCR結果を保存するファイル

detectTextForAllImages(inputDir, outputPath);
