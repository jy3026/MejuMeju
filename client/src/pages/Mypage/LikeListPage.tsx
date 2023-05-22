import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { ButtonDark } from "../../components/Common/Button";
import Pagination from "../../components/AlcoholPage/Pagination";
import PriceDisplay from "@components/Common/PriceDisplay";

//components
interface Likeitem {
  titleKor: string;
  price: number;
  quantity: number;
  capacity: number;
  reviewRating: number;
  itemId: number;
  checked: boolean;
  profile: string;
}
// interface Newitem {
//   [title: string]: number;
// }
// type SelectType = Array<{ [key: string]: number }>;

//page에서 table로 내린애
// interface TableProps {
//   likelist: Likeitem[];
// }
// interface BtnProps {
//   ButtonDark: string;
//   onClick: () => void;
// }

const TotalStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
`;
const PageTitle = styled.div`
  /* border: 1px solid black; */
  /* flex-grow: 1; */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;
  height: 100px;
`;

const LikepageContainer = styled.div`
  /* border: 5px solid blue; */
  width: 100vw;
  height: 100vh;
  max-width: 1250px;
  margin-top: 150px; //호버됬을때가 150이래서 일단 150으로 설정함.
  display: flex;
  flex-direction: column;
`;

//누구누구님 등급써있는부분
const LikepageHeadStyled = styled.div`
  border: 3px solid #dedede;
  /* flex-grow: 3; */
  font-size: 18px;
  color: #181818;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background-color: #dedede; */
  height: 100px;
  padding-left: 10px;
  font-weight: 600;

  /* > p {
    margin-left: 10px;
    margin-bottom: 10px;
    color: #181818;
    font-weight: 600;
  } */
`;

//찜리스트 나오는 부분
const LikepageMainStyled = styled.div`
  /* border: 3px solid red; */
  /* flex-grow: 5; */
  > * {
    /* margin-bottom: 30px; */
    font-size: 18px;
    /* margin-left: 60px; */
  }
  /* > p {
    margin-top: 30px;
    font-weight: 600;
    margin-left: 60px;
  } */
`;
const HeadTable = styled.div`
  /* border: 3px solid blue; */
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 10px;
  padding-left: 10px;
  font-weight: 600;
  line-height: 25px;
`;
const TotalTableStyled = styled.div`
  border: 3px solid #dedede;
  flex-grow: 1;
`;
const StyledTable = styled.table`
  /* border: 1px solid black; */
  font-size: 18px;
  /* margin-top: 200px; */
  width: 1240px;
  height: 300px;
`;

const StyledTh = styled.th`
  /* border: 1px solid black; */
  padding: 8px;
`;

const StyledTd = styled.td`
  /* border: 1px solid black; */
  padding: 8px;
  text-align: center;
  vertical-align: middle;

  .button-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  > img {
    width: 50%;
    height: 80px;
  }
`;
// const StyledBtn = styled.button`
// display: flex;
// `;

//맨밑 페이지네이션부분
const PigStyled = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 10px;
  /* margin-bottom: 20px; */
`;

// const Table = ({ likelist }: TableProps) => {
//   return (
//     <>
//       {console.log(likelist)}
//       <StyledTable>
//         <thead>
//           <tr>
//             <StyledTh>
//               <input type="checkbox" />
//             </StyledTh>
//             <StyledTh>상품 목록</StyledTh>
//             <StyledTh>수 량(개)</StyledTh>
//             <StyledTh>가 격(원)</StyledTh>
//           </tr>
//         </thead>
//         <tbody>
//           {likelist.map((el: Likeitem, idx: number) => {
//             return (
//               <tr key={idx}>
//                 <StyledTd>
//                   <input type="checkbox" />
//                 </StyledTd>
//                 <StyledTd>{el.titleKor}</StyledTd>
//                 <StyledTd>{el.quantity}</StyledTd>
//                 <StyledTd>{el.price}</StyledTd>
//               </tr>
//             );
//           })}
//         </tbody>
//       </StyledTable>
//     </>
//   );
// };

const LikePage = () => {
  const [likelist, setLikelist] = useState<Likeitem[]>([]);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [select, setSelect] = useState<number[] | null>(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  const totalPages = Math.ceil(totalLength / 5); //나오는 총 페이지수
  const paginationData = likelist.slice(5 * (currentPage - 1), 5 * currentPage); //각페이지에서 보이는내용
  // console.log(currentPage);
  // console.log(likelist);
  // console.log(totalpages);
  // console.log(itemsPerPage);
  // console.log(paginationData);

  const LikeGetHandle = () => {
    const access_token = `Bearer ${localStorage.getItem("authToken")}`;
    axios
      // .get(`http://localhost:8081/favorite`, {
      .get(`${process.env.REACT_APP_API_URL}/members/favorite`, {
        // .get(`http://ec2-3-39-189-208.ap-northeast-2.compute.amazonaws.com:8080/members/favorite`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
          "ngrok-skip-browser-warning": "69420", // ngrok cors 에러
        },
      })

      .then((res) => {
        // console.log(res);
        // console.log(res.data.data[0]);
        // console.log(res.data.data);
        setLikelist(res.data.data);
        // console.log(res.data.data.length);
        setTotalLength(res.data.data.length);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    LikeGetHandle();
  }, []);

  const handleDeleteBtn = (itemId: number) => {
    const access_token = `Bearer ${localStorage.getItem("authToken")}`;
    axios
      .delete(`${process.env.REACT_APP_API_URL}/items/${itemId}/favorite`, {
        // .delete(`http://ec2-3-39-189-208.ap-northeast-2.compute.amazonaws.com:8080/items/${itemId}/favorite`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
          "ngrok-skip-browser-warning": "69420", // ngrok cors 에러
        },
      })
      .then((res) => {
        LikeGetHandle();
      })
      .catch((error) => console.log(error));
  };

  const handleCartBtn = (itemId: number) => {
    // console.log("ddd");
    // console.log(itemId);
    const access_token = `Bearer ${localStorage.getItem("authToken")}`;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/cart`,
        // .post(
        //   `http://ec2-3-39-189-208.ap-northeast-2.compute.amazonaws.com:8080/cart`,
        {
          itemId: itemId,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: access_token,
            "ngrok-skip-browser-warning": "69420", // ngrok cors 에러
          },
        },
      )
      .then((res) => navigate("/cart"))
      .catch((err) => console.log(err));
  };
  //닉네임 불러오는부분 0520추가함 데이터들어오는지 확인해봐야하는부분임
  useEffect(() => {
    const access_token = `Bearer ${localStorage.getItem("authToken")}`;
    axios
      .get(`${process.env.REACT_APP_API_URL}/members`, {
        // .get(`http://ec2-3-39-189-208.ap-northeast-2.compute.amazonaws.com:8080/members`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
          "ngrok-skip-browser-warning": "69420",
        },
      })
      .then((res) => setUserName(res.data.data.displayName))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <TotalStyled>
        <LikepageContainer>
          <PageTitle>
            <div>My Page</div>
            <MdOutlineKeyboardArrowRight size="20px" />
            <div>찜리스트</div>
          </PageTitle>
          <LikepageHeadStyled>
            <p>{userName}님의 등급은 Green입니다.</p>
          </LikepageHeadStyled>
          <LikepageMainStyled>
            <HeadTable>
              <p>찜리스트</p>
              <p>총 {likelist.length}건</p>
            </HeadTable>
            <TotalTableStyled>
              <StyledTable>
                <thead>
                  <tr>
                    <StyledTh></StyledTh>
                    <StyledTh>상품 목록</StyledTh>
                    <StyledTh>수 량(개)</StyledTh>
                    <StyledTh>가 격(원)</StyledTh>
                    <StyledTh></StyledTh>
                    <StyledTh></StyledTh>
                  </tr>
                </thead>
                <tbody>
                  {paginationData.map((el: Likeitem, idx: number) => {
                    return (
                      <tr key={idx}>
                        <StyledTd>
                          <img src={el.profile} />
                        </StyledTd>
                        <StyledTd>{el.titleKor}</StyledTd>
                        <StyledTd>{el.quantity}</StyledTd>
                        <StyledTd>
                          <PriceDisplay price={el.price} />
                        </StyledTd>
                        <StyledTd>
                          {/* <StyledBtn> */}
                          <div className="button-container">
                            <ButtonDark
                              width="100px"
                              height="50%"
                              onClick={() => {
                                handleCartBtn(el.itemId);
                              }}
                            >
                              장바구니
                            </ButtonDark>
                          </div>
                          {/* <ButtonDark onClick={() => handleCartBtn(el.itemId)}>장바구니</ButtonDark> */}
                        </StyledTd>
                        <StyledTd>
                          <div className="button-container">
                            <ButtonDark
                              width="100px"
                              height="50%"
                              onClick={() => {
                                handleDeleteBtn(el.itemId);
                              }}
                            >
                              삭제
                            </ButtonDark>
                          </div>
                          {/* </StyledBtn> */}
                        </StyledTd>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
            </TotalTableStyled>
          </LikepageMainStyled>
          <PigStyled>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={5}
              totalData={likelist.length}
            />
          </PigStyled>
        </LikepageContainer>
      </TotalStyled>
    </>
  );
};

export default LikePage;
