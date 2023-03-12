import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { HashLoader } from "react-spinners";
import NFTCard from "../../components/NFTCard";
import { solConnection } from "../../contexts/utils";
import Head from "next/head";

export default function CreateRaffle() {
  const wallet = useWallet();
  const [pageLoading, setPageLoading] = useState(false);
  const [hide, setHide] = useState(false);

  const [nftList, setNftList] = useState();

  const getUnstakedNFTs = async () => {
    setPageLoading(true);
    const unstakedNftList = await getMetadataDetail();
    setNftList(unstakedNftList);
    setHide(!hide);
    setPageLoading(false);
  };

  const getMetadataDetail = async () => {
    const nftsList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey,
      connection: solConnection,
    });
    return nftsList;
  };
  useEffect(() => {
    getUnstakedNFTs();
    // eslint-disable-next-line
  }, [wallet.connected]);

  return (
    <>
      <Head>
        <title>Monkai | Create</title>
      </Head>
      <div className="raffle">
        <div className="container">
          {pageLoading ? (
            <div className="page-loading">
              <div className="loading-box">
                <HashLoader size={32} color="#3498db" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="create-title">CREATE</h1>
              <div className="raffle-content">
                {nftList &&
                  nftList.length !== 0 &&
                  nftList.map((item, key) => (
                    <NFTCard mint={item.mint} key={key} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
