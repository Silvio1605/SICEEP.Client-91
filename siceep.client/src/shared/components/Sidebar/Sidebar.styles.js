import { styled } from '@mui/material/styles';

export const SidebarContainer = styled('div')`
  color: #333333;
  background: #ffffff;
  position: sticky;
  top: 0; 
  padding-top: 20px;
  height: 100vh;
  width: ${({ $isOpen }) => ($isOpen ? "280px" : "90px")}; 
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1); 
  z-index: 100; 
  border-right: 1px solid #eaedf1; 
  box-shadow: 2px 0 8px rgba(0,0,0,0.02); 

  .Sidebarbutton {
    position: absolute;
    top: 32px; 
    right: -16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 64, 128, 0.15); 
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ $isOpen }) => ($isOpen ? "initial" : "rotate(180deg)")};
    border: 1px solid #eaedf1;
    color: #004080; 
    font-size: 1rem;
    z-index: 10;

    &:hover {
      background: #f0f4f8;
      transform: ${({ $isOpen }) => ($isOpen ? "scale(1.1)" : "rotate(180deg) scale(1.1)")};
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .Logocontent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-bottom: 20px; 
    border-bottom: 1px solid #eaedf1;
    margin-bottom: 10px;

    .imgcontent img {
      width: ${({ $isOpen }) => ($isOpen ? "75px" : "40px")};
      transition: all 0.3s ease;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
    }

    h2 {
      display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
      font-size: 1.05rem;
      font-weight: 800;
      color: #004080;
      text-align: center;
      white-space: nowrap;
      letter-spacing: -0.5px;
    }
  }

  .MenuScroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 20px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb {
      background: #dce1e6;
      border-radius: 10px;
    }
  }

  .SectionContainer { margin-bottom: 4px; }

  .CategoryHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    cursor: pointer;
    color: #7b8a9c; 
    transition: all 0.2s;
    user-select: none;

    &:hover { color: #004080; }

    .CategoryTitle {
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    svg { font-size: 1.2rem; }

    .ClosedIndicator {
      width: 20px;
      height: 3px;
      background-color: #dce1e6;
      border-radius: 2px;
      margin: 0 auto;
      transition: all 0.3s;
    }

    &:hover .ClosedIndicator { background-color: #004080; }
  }

  .ItemsContainer { padding-bottom: 8px; }

  .LinkContainer {
    margin: 2px 0;
    padding: 0 ${({ $isOpen }) => ($isOpen ? "12px" : "8px")};
    transition: padding 0.3s ease;
    
    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #555555; 
      height: 44px; 
      border-radius: 8px; 
      padding: 0 12px;
      transition: all 0.2s ease-in-out;
      white-space: nowrap;
      position: relative;
      overflow: hidden;

      .Linkicon {
        display: flex;
        align-items: center;
        svg {
          font-size: 22px; 
          min-width: 22px; 
          color: #7b8a9c !important; 
          transition: color 0.2s;
        }
      }

      span {
        margin-left: 16px;
        font-weight: 500; 
        font-size: 0.9rem;
      }

      &:hover {
        background: #f4f7fa; 
        color: #004080; 
        
        .Linkicon svg { color: #004080 !important; } 
      }

      &.active {
        background: #eef4fc; 
        color: #004080;
        font-weight: 700;
        
        .Linkicon svg { color: #004080 !important; } 

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 15%;
          height: 70%;
          width: 4px;
          background-color: #004080;
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
`;