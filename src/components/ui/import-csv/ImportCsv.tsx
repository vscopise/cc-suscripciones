'use client';

import Link from 'next/link';
import React, { useState, useRef, ChangeEvent, CSSProperties } from 'react';
import { useCSVReader } from 'react-papaparse';


interface Props {
  description: string;
  item: string;
}

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: '50%',
  } as CSSProperties,
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '50%',
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  } as CSSProperties,
};



export const ImportCsv = ({ description, item }: Props) => {

  const { CSVReader } = useCSVReader();

  const [message, setMessage] = useState('');

  const templateUrl =`/template-${item.toLowerCase()}s.csv`;

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-12 gap-4">
      <div className="col-span-12 sm:col-span-2 py-2">
        <span className="align-middle">{description}</span>
      </div>
      <div className="col-span-12 sm:col-span-10">
        <CSVReader
          onUploadAccepted={(results: any) => {
            
            fetch("/api/upload/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                csv: results,
                item: item
              }),
            })
              .then(res => res.json())
              .then(message => setMessage(message))
              .catch((error) => {
                console.warn(error);
              });
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            getRemoveFileProps,
            ProgressBar
          }: any) => (
            <>
              <div style={styles.csvReader}>
                <button className="btn btn-primary" type='button' {...getRootProps()}>
                  Cargar archivo
                </button>
                <div style={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <button {...getRemoveFileProps()} style={styles.remove} onClick={() => setMessage('')}>
                  Quitar
                </button>
                  <Link href={templateUrl} className="text-xs content-center" download>
                  Descargar plantilla
                </Link>
              </div>
              <ProgressBar style={styles.progressBarBackgroundColor} />
            </>
          )}
        </CSVReader>
      <div className="w-full">{message}</div>
      </div>
    </div>
  )
}
